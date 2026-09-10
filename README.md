# partfolio_website
The source code of my website is Pardfolio.


My website design is inspired by Pornhub. You can check out the pictures and see for yourself.
<img width="1920" height="1080" alt="изображение" src="https://github.com/user-attachments/assets/292a0e23-666a-45cc-9569-995f03c95164" />
<img width="1920" height="1080" alt="изображение" src="https://github.com/user-attachments/assets/1d757a3d-5304-4afd-bfc8-271980fb7b09" />
<img width="1920" height="1080" alt="изображение" src="https://github.com/user-attachments/assets/dff0c138-bb40-45e4-bfb9-ac5a14371247" />

## ✨ Features

- **Portfolio Projects** — Add, edit and delete projects with images and videos
- **About Section** — Separate section with its own entries and media
- **Media Upload** — Support for PNG, JPG, JPEG, GIF, WEBP, MP4, WEBM
- **Featured Carousel** — Infinite scrolling project carousel on the homepage
- **Animated Preloaders** — Two custom CSS preloaders
- **Profession Rotator** — Animated text rotation in the hero section
- **Binary Rings Widget** — Decorative animated binary rings
- **Responsive Design** — Works on different screen sizes
- **Minification** — Automatic HTML, JS and CSS minification via Flask-Minify

## 📋 Requirements

- **Python 3.6+**
- **Flask** (web framework)
- **Flask-Minify** (minification)
- **Modern web browser** (Chrome, Firefox, Edge, etc.)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Vad5m/vad5m_dev.git
cd vad5m_dev
```

### 2. Set up Python virtual environment (recommended)
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate     # On Windows
```

### 3. Install dependencies
```bash
pip install flask flask-minify
```

### 4. Create required directories
```bash
mkdir -p static/uploads templates
```

## 🎮 Usage

### Quick Start
```bash
python3 main.py
```

The server will start at `http://localhost:5000`

### Access the Site
Open your browser and navigate to:
```
http://localhost:5000
```

### Database
`projects.db` is created automatically on first launch with two tables:
- **projects** — portfolio projects
- **about** — "About me" entries

## 🗂️ Project Structure

```
vad5m_dev/
├── main.py                 
├── projects.db            
├── templates/
│   ├── partfolio_base.html
│   ├── partfolio_index.html
│   ├── partfolio_partfolio.html
│   └── partfolio_about.html
├── static/
│   ├── favicon.ico
│   ├── fav.png
│   └── uploads/             
└── README.md
```


<pre>
⠄⠄⣿⣿⣿⣿⠘⡿⢛⣿⣿⣿⣿⣿⣧⢻⣿⣿⠃⠸⣿⣿⣿⠄⠄⠄⠄⠄
⠄⠄⣿⣿⣿⣿⢀⠼⣛⣛⣭⢭⣟⣛⣛⣛⠿⠿⢆⡠⢿⣿⣿⠄⠄⠄⠄⠄
⠄⠄⠸⣿⣿⢣⢶⣟⣿⣖⣿⣷⣻⣮⡿⣽⣿⣻⣖⣶⣤⣭⡉⠄⠄⠄⠄⠄
⠄⠄⠄⢹⠣⣛⣣⣭⣭⣭⣁⡛⠻⢽⣿⣿⣿⣿⢻⣿⣿⣿⣽⡧⡄⠄⠄⠄
⠄⠄⠄⠄⣼⣿⣿⣿⣿⣿⣿⣿⣿⣶⣌⡛⢿⣽⢘⣿⣷⣿⡻⠏⣛⣀⠄⠄
⠄⠄⠄⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠙⡅⣿⠚⣡⣴⣿⣿⣿⡆⠄
⠄⠄⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠄⣱⣾⣿⣿⣿⣿⣿⣿⠄
⠄⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⠄
⠄⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠣⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄
⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠑⣿⣮⣝⣛⠿⠿⣿⣿⣿⣿⠄
⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄
</pre>


