from flask import Blueprint, render_template, request, redirect, url_for, flash, send_from_directory, jsonify, Flask, session
from flask_minify import Minify
import os
from werkzeug.utils import secure_filename
import time
import sqlite3
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FOLDER = os.path.join(BASE_DIR, 'templates')
STATIC_FOLDER   = os.path.join(BASE_DIR, 'static')
UPLOAD_FOLDER   = os.path.join(STATIC_FOLDER, 'uploads')
DATABASE        = os.path.join(BASE_DIR, 'projects.db')

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin')

bp = Blueprint(
    'portfolio',
    __name__,
    url_prefix='/',
    template_folder=TEMPLATE_FOLDER,
    static_folder=STATIC_FOLDER,
    static_url_path='/static',
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            tags TEXT,
            media TEXT,
            link TEXT,
            about_content TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS about (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            tags TEXT,
            media TEXT,
            link TEXT,
            about_content TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()

def get_projects():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT id, title, description, tags, media, link FROM projects ORDER BY created_at DESC')
    projects = c.fetchall()
    conn.close()
    result = []
    for p in projects:
        media_list = []
        if p[4]:
            try:
                media_list = json.loads(p[4])
            except:
                media_list = [p[4]] if p[4] else []
        result.append({
            'id': p[0],
            'title': p[1],
            'description': p[2],
            'tags': p[3].split(',') if p[3] else [],
            'media': media_list,
            'link': p[5] or ''
        })
    return result

def add_project(title, description, tags, media_paths, link, about_content=''):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    media_json = json.dumps(media_paths)
    c.execute('''
        INSERT INTO projects (title, description, tags, media, link, about_content)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, description, tags, media_json, link, about_content))
    conn.commit()
    conn.close()
    print(f"Project added: {title}")

def update_project(project_id, title, description, tags, media_paths, link, delete_media_list=None, about_content=None):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    c.execute('SELECT media, about_content FROM projects WHERE id = ?', (project_id,))
    result = c.fetchone()
    if not result:
        conn.close()
        return False

    try:
        current_media = json.loads(result[0]) if result[0] else []
    except:
        current_media = [result[0]] if result[0] else []

    if delete_media_list:
        for url in delete_media_list:
            if url in current_media:
                current_media.remove(url)
                full_path = os.path.join(UPLOAD_FOLDER, os.path.basename(url))
                if os.path.exists(full_path):
                    os.remove(full_path)

    if media_paths:
        current_media.extend(media_paths)

    if about_content is not None:
        current_about = about_content
    else:
        current_about = result[1] or ''

    media_json = json.dumps(current_media)
    c.execute('''
        UPDATE projects
        SET title = ?, description = ?, tags = ?, media = ?, link = ?, about_content = ?
        WHERE id = ?
    ''', (title, description, tags, media_json, link, current_about, project_id))

    conn.commit()
    conn.close()
    print(f"Project updated ID {project_id}: {title}")
    return True

def delete_project(project_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT media FROM projects WHERE id = ?', (project_id,))
    result = c.fetchone()
    if result:
        try:
            media_list = json.loads(result[0]) if result[0] else []
        except:
            media_list = [result[0]] if result[0] else []

        for media_path in media_list:
            if media_path:
                full_path = os.path.join(UPLOAD_FOLDER, os.path.basename(media_path))
                if os.path.exists(full_path):
                    os.remove(full_path)

        c.execute('DELETE FROM projects WHERE id = ?', (project_id,))
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False

def get_about_projects():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT id, title, description, tags, media, link, about_content FROM about ORDER BY created_at DESC')
    projects = c.fetchall()
    conn.close()

    result = []
    for p in projects:
        media_list = []
        if p[4]:
            try:
                media_list = json.loads(p[4])
            except:
                media_list = [p[4]] if p[4] else []
        result.append({
            'id': p[0],
            'title': p[1],
            'description': p[2],
            'tags': p[3].split(',') if p[3] else [],
            'media': media_list,
            'link': p[5] or '',
            'about_content': p[6] or ''
        })
    return result

def add_about_project(title, description, tags, media_paths, link, about_content=''):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    media_json = json.dumps(media_paths)
    c.execute('''
        INSERT INTO about (title, description, tags, media, link, about_content)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, description, tags, media_json, link, about_content))
    conn.commit()
    conn.close()
    print(f"About project added: {title}")

def update_about_project(project_id, title, description, tags, media_paths, link, delete_media_list=None, about_content=None):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    c.execute('SELECT media, about_content FROM about WHERE id = ?', (project_id,))
    result = c.fetchone()
    if not result:
        conn.close()
        return False

    try:
        current_media = json.loads(result[0]) if result[0] else []
    except:
        current_media = [result[0]] if result[0] else []

    if delete_media_list:
        for url in delete_media_list:
            if url in current_media:
                current_media.remove(url)
                full_path = os.path.join(UPLOAD_FOLDER, os.path.basename(url))
                if os.path.exists(full_path):
                    os.remove(full_path)

    if media_paths:
        current_media.extend(media_paths)

    if about_content is not None:
        current_about = about_content
    else:
        current_about = result[1] or ''

    media_json = json.dumps(current_media)
    c.execute('''
        UPDATE about
        SET title = ?, description = ?, tags = ?, media = ?, link = ?, about_content = ?
        WHERE id = ?
    ''', (title, description, tags, media_json, link, current_about, project_id))

    conn.commit()
    conn.close()
    print(f"About project updated ID {project_id}: {title}")
    return True

def delete_about_project(project_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT media FROM about WHERE id = ?', (project_id,))
    result = c.fetchone()
    if result:
        try:
            media_list = json.loads(result[0]) if result[0] else []
        except:
            media_list = [result[0]] if result[0] else []

        for media_path in media_list:
            if media_path:
                full_path = os.path.join(UPLOAD_FOLDER, os.path.basename(media_path))
                if os.path.exists(full_path):
                    os.remove(full_path)

        c.execute('DELETE FROM about WHERE id = ?', (project_id,))
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False

init_db()

print(f"BASE_DIR: {BASE_DIR}")
print(f"STATIC_FOLDER: {STATIC_FOLDER}")
print(f"STATIC_FOLDER существует: {os.path.exists(STATIC_FOLDER)}")
print(f"CSS папка существует: {os.path.exists(os.path.join(STATIC_FOLDER, 'css'))}")
print(f"JS папка существует: {os.path.exists(os.path.join(STATIC_FOLDER, 'js'))}")

def is_admin():
    return session.get('is_admin', False)

def wants_admin():
    return 'admin' in request.args

def require_admin_or_redirect():
    if not is_admin():
        return redirect(url_for('portfolio.admin_login', next=request.url))
    return None

@bp.route('/')
def index():
    projects = get_projects()
    return render_template('partfolio_index.html', projects=projects)

@bp.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form.get('password', '')
        if password == ADMIN_PASSWORD:
            session['is_admin'] = True
            session.permanent = True
            next_url = request.args.get('next', url_for('portfolio.index'))
            if 'admin' not in next_url:
                next_url = next_url + ('&' if '?' in next_url else '?') + 'admin'
            return redirect(next_url)
        else:
            flash('Неверный пароль', 'error')
    return render_template('partfolio_admin_login.html')

@bp.route('/admin-logout')
def admin_logout():
    session.pop('is_admin', None)
    return redirect(url_for('portfolio.index'))

@bp.route('/partfolio', methods=['GET', 'POST'])
def partfolio():
    if request.method == 'POST':
        if not is_admin():
            flash('Требуется авторизация администратора', 'error')
            return redirect(url_for('portfolio.admin_login', next=request.url))
        # ... остальная логика POST без изменений
        title = request.form.get('title', '').strip()
        description = request.form.get('desc', '').strip()
        tags = request.form.get('tags', '').strip()
        link = request.form.get('link', '').strip()
        about_content = request.form.get('about_content', '').strip()
        edit_id = request.form.get('edit_id', '').strip()

        if not title or not description:
            flash('Fill in title and description', 'error')
            return redirect(url_for('portfolio.partfolio'))

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        saved_paths = []

        if 'media' in request.files:
            files = request.files.getlist('media')
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    name, ext = os.path.splitext(filename)
                    filename = f"{name}_{int(time.time() * 1000)}_{len(saved_paths)}{ext}"
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    saved_paths.append(f'/uploads/{filename}')
                elif file and file.filename:
                    flash(f'Invalid format: {file.filename}', 'error')
                    return redirect(url_for('portfolio.partfolio'))

        if edit_id:
            try:
                project_id = int(edit_id)
                delete_media_list = request.form.getlist('delete_media[]')

                success = update_project(
                    project_id,
                    title,
                    description,
                    tags,
                    saved_paths,
                    link,
                    delete_media_list,
                    about_content
                )

                if success:
                    flash(f'Project "{title}" updated!', 'success')
                else:
                    flash('Project not found', 'error')
                return redirect(url_for('portfolio.partfolio'))
            except ValueError:
                flash('Error editing project', 'error')
                return redirect(url_for('portfolio.partfolio'))

        if not saved_paths:
            flash('Upload at least one image or video', 'error')
            return redirect(url_for('portfolio.partfolio'))

        add_project(title, description, tags, saved_paths, link, about_content)
        flash(f'Project "{title}" added!', 'success')
        return redirect(url_for('portfolio.partfolio'))

    if wants_admin() and not is_admin():
        return redirect(url_for('portfolio.admin_login', next=request.url))

    projects = get_projects()
    return render_template('partfolio_partfolio.html', projects=projects, is_admin=is_admin())

@bp.route('/about', methods=['GET', 'POST'])
def about():
    if request.method == 'POST':
        if not is_admin():
            flash('Требуется авторизация администратора', 'error')
            return redirect(url_for('portfolio.admin_login', next=request.url))
        # ... остальная логика POST без изменений
        title = request.form.get('title', '').strip()
        description = request.form.get('desc', '').strip()
        tags = request.form.get('tags', '').strip()
        link = request.form.get('link', '').strip()
        about_content = request.form.get('about_content', '').strip()
        edit_id = request.form.get('edit_id', '').strip()

        if not title or not description:
            flash('Fill in title and description', 'error')
            return redirect(url_for('portfolio.about'))

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        saved_paths = []

        if 'media' in request.files:
            files = request.files.getlist('media')
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    name, ext = os.path.splitext(filename)
                    filename = f"{name}_{int(time.time() * 1000)}_{len(saved_paths)}{ext}"
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    saved_paths.append(f'/uploads/{filename}')
                elif file and file.filename:
                    flash(f'Invalid format: {file.filename}', 'error')
                    return redirect(url_for('portfolio.about'))

        if edit_id:
            try:
                project_id = int(edit_id)
                delete_media_list = request.form.getlist('delete_media[]')

                success = update_about_project(
                    project_id,
                    title,
                    description,
                    tags,
                    saved_paths,
                    link,
                    delete_media_list,
                    about_content
                )

                if success:
                    flash(f'Entry "{title}" updated!', 'success')
                else:
                    flash('Entry not found', 'error')
                return redirect(url_for('portfolio.about'))
            except ValueError:
                flash('Error editing entry', 'error')
                return redirect(url_for('portfolio.about'))

        if not saved_paths:
            flash('Upload at least one image or video', 'error')
            return redirect(url_for('portfolio.about'))

        add_about_project(title, description, tags, saved_paths, link, about_content)
        flash(f'Entry "{title}" added!', 'success')
        return redirect(url_for('portfolio.about'))

    if wants_admin() and not is_admin():
        return redirect(url_for('portfolio.admin_login', next=request.url))

    projects = get_about_projects()
    return render_template('partfolio_about.html', projects=projects, is_admin=is_admin())

@bp.route('/delete_about_project/<int:project_id>', methods=['POST'])
def delete_about_project_route(project_id):
    if not is_admin():
        flash('Требуется авторизация администратора', 'error')
        return redirect(url_for('portfolio.admin_login', next=request.url))
    if delete_about_project(project_id):
        flash('Entry deleted', 'success')
    else:
        flash('Entry not found', 'error')
    return redirect(url_for('portfolio.about'))

@bp.route('/delete_project/<int:project_id>', methods=['POST'])
def delete_project_route(project_id):
    if not is_admin():
        flash('Требуется авторизация администратора', 'error')
        return redirect(url_for('portfolio.admin_login', next=request.url))
    if delete_project(project_id):
        flash('Project deleted', 'success')
    else:
        flash('Project not found', 'error')
    return redirect(url_for('portfolio.partfolio'))

@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@bp.route('/favicon.ico')
def favicon():
    return send_from_directory(STATIC_FOLDER, 'favicon.ico')

@bp.route('/fav.png')
def fav_png():
    return send_from_directory(STATIC_FOLDER, 'fav.png')
