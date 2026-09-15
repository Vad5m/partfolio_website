(function() {
    const container = document.getElementById('particles');
    if (container) {
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 2 + 1;
            const tx = (Math.random() - 0.5) * 400;
            const ty = (Math.random() - 0.5) * 400;
            p.style.cssText =
                `width: ${size}px; height: ${size}px; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; --tx: ${tx}px; --ty: ${ty}px; animation-duration: ${Math.random() * 22 + 14}s; animation-delay: ${Math.random() * 8}s; opacity: ${Math.random() * 0.2 + 0.03};`;
            container.appendChild(p);
        }
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        toast.style.opacity = '1';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
                toast.style.opacity = '1';
            }, 400);
        }, 3000);
    }
    window.showToast = showToast;

    const toggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
                toggle.classList.remove('active');
                mobileNav.classList.remove('open');
            }
        });
    }

    const isAdmin = window.location.search.includes('admin');
    const adminBadge = document.getElementById('adminBadge');
    const addBtnWrapper = document.getElementById('addBtnWrapper');

    function updateAdminUI() {
        if (isAdmin) {
            if (adminBadge) adminBadge.classList.add('show');
            if (addBtnWrapper) addBtnWrapper.classList.remove('hidden');
            document.querySelectorAll('.action-buttons').forEach(btn => {
                btn.classList.add('show');
                btn.style.display = 'flex';
            });
        } else {
            if (adminBadge) adminBadge.classList.remove('show');
            if (addBtnWrapper) addBtnWrapper.classList.add('hidden');
            document.querySelectorAll('.action-buttons').forEach(btn => {
                btn.classList.remove('show');
                btn.style.display = 'none';
            });
        }
    }

    const ABOUT_URL = window.ABOUT_URL || '/about';
    const DELETE_ABOUT_URL_BASE = window.DELETE_ABOUT_URL_BASE || '/about/delete/';

    function initCardHandlers() {
        document.querySelectorAll('.project-card').forEach(card => {
            const cardClickHandler = function(e) {
                if (e.target.closest('.action-btn')) return;
                try {
                    const dataAttr = this.dataset.project;
                    if (dataAttr) {
                        const data = JSON.parse(dataAttr);
                        if (data) openViewer(data);
                    }
                } catch (err) {
                    console.error('Ошибка парсинга данных проекта', err);
                }
            };
            card.removeEventListener('click', cardClickHandler);
            card.addEventListener('click', cardClickHandler);
            card._cardClickHandler = cardClickHandler;

            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
                const deleteHandler = function(e) {
                    e.stopPropagation();
                    const id = this.dataset.id;
                    if (id) openConfirm(id);
                };
                deleteBtn.removeEventListener('click', deleteHandler);
                deleteBtn.addEventListener('click', deleteHandler);
                deleteBtn._deleteHandler = deleteHandler;
            }

            const editBtn = card.querySelector('.edit-btn');
            if (editBtn) {
                const editHandler = function(e) {
                    e.stopPropagation();
                    const card = this.closest('.project-card');
                    try {
                        const dataAttr = card.dataset.project;
                        if (dataAttr) {
                            const data = JSON.parse(dataAttr);
                            if (data) openModal('edit', data);
                        }
                    } catch (err) {
                        console.error('Ошибка парсинга данных для редактирования', err);
                        showToast('Ошибка загрузки данных', 'error');
                    }
                };
                editBtn.removeEventListener('click', editHandler);
                editBtn.addEventListener('click', editHandler);
                editBtn._editHandler = editHandler;
            }
        });
    }

    const overlay = document.getElementById('modalOverlay');
    const addBtn = document.getElementById('addProjectBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('projectForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const existingMediaList = document.getElementById('existingMediaList');
    const modalTitle = document.getElementById('modalTitle');
    const modalSub = document.getElementById('modalSub');
    const submitBtn = document.getElementById('submitBtn');
    const editProjectId = document.getElementById('editProjectId');

    let editMode = false;

    function openModal(mode = 'add', data = null) {
        if (!overlay) return;
        editMode = mode === 'edit';
        form.querySelectorAll('input[name="delete_media[]"]').forEach(el => el.remove());

        if (editMode && data) {
            modalTitle.textContent = 'Редактировать запись';
            modalSub.textContent = 'Измените данные и загрузите новые медиафайлы';
            submitBtn.textContent = 'Сохранить';
            document.getElementById('projectTitle').value = data.title || '';
            document.getElementById('projectDesc').value = data.description || '';
            document.getElementById('projectTags').value = (data.tags || []).join(', ');
            document.getElementById('projectLink').value = data.link || '';
            editProjectId.value = data.id || '';
            form.action = ABOUT_URL;

            existingMediaList.innerHTML = '';
            if (data.media && data.media.length > 0) {
                data.media.forEach((url, idx) => {
                    const span = document.createElement('span');
                    span.className = 'file-item';
                    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                    const fileName = url.split('/').pop() || `media_${idx}`;
                    span.innerHTML = `
                        ${isVideo ? '🎬' : '🖼️'} ${fileName}
                        <button type="button" class="remove-existing" data-url="${url}">✕</button>
                    `;
                    existingMediaList.appendChild(span);
                });
                document.querySelectorAll('#existingMediaList .remove-existing').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const url = this.dataset.url;
                        const hidden = document.createElement('input');
                        hidden.type = 'hidden';
                        hidden.name = 'delete_media[]';
                        hidden.value = url;
                        form.appendChild(hidden);
                        this.closest('.file-item').remove();
                    });
                });
            }
            fileInput.value = '';
            fileList.innerHTML = '';
        } else {
            modalTitle.textContent = 'Новая запись';
            modalSub.textContent = 'Заполните поля и загрузите изображения или видео';
            submitBtn.textContent = 'Добавить';
            editProjectId.value = '';
            form.action = ABOUT_URL;
            form.reset();
            fileList.innerHTML = '';
            existingMediaList.innerHTML = '';
            fileInput.value = '';
        }
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    window.openModal = openModal;

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        form.reset();
        fileList.innerHTML = '';
        existingMediaList.innerHTML = '';
        fileInput.value = '';
        form.querySelectorAll('input[name="delete_media[]"]').forEach(el => el.remove());
        editMode = false;
        form.action = ABOUT_URL;
    }

    if (addBtn) addBtn.addEventListener('click', () => openModal('add'));
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });
    }

    const fileLabel = document.querySelector('.file-upload-label');
    let savedFiles = [];

    function updateFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `
                📎 ${files[i].name}
                <button type="button" class="remove-file" data-index="${i}">✕</button>
            `;
            fileList.appendChild(div);
        }
        document.querySelectorAll('#fileList .remove-file').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(this.dataset.index);
                const dt = new DataTransfer();
                const filesArr = Array.from(fileInput.files);
                filesArr.splice(idx, 1);
                filesArr.forEach(f => dt.items.add(f));
                fileInput.files = dt.files;
                updateFileList();
                savedFiles = Array.from(fileInput.files || []);
            });
        });
    }

    if (fileInput) {
        fileInput.addEventListener('click', function(e) {
            savedFiles = Array.from(this.files || []);
            e.stopPropagation();
        });

        fileInput.addEventListener('change', function(e) {
            const newFiles = Array.from(e.target.files || []);
            const existingFiles = savedFiles.length > 0 ? savedFiles : Array.from(this.files || []);

            if (existingFiles.length > 0 && newFiles.length > 0) {
                const dt = new DataTransfer();
                existingFiles.forEach(f => dt.items.add(f));
                newFiles.forEach(f => {
                    const exists = existingFiles.some(ex =>
                        ex.name === f.name &&
                        ex.size === f.size &&
                        ex.lastModified === f.lastModified
                    );
                    if (!exists) {
                        dt.items.add(f);
                    }
                });
                this.files = dt.files;
            }
            updateFileList();
            savedFiles = Array.from(this.files || []);
        });
    }

    if (fileLabel) {
        fileLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        fileLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        fileLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const droppedFiles = e.dataTransfer.files;
            if (droppedFiles.length > 0 && fileInput) {
                const existingFiles = Array.from(fileInput.files || []);
                const dt = new DataTransfer();
                existingFiles.forEach(f => dt.items.add(f));
                Array.from(droppedFiles).forEach(f => {
                    const exists = existingFiles.some(ex =>
                        ex.name === f.name &&
                        ex.size === f.size &&
                        ex.lastModified === f.lastModified
                    );
                    if (!exists) dt.items.add(f);
                });
                fileInput.files = dt.files;
                updateFileList();
                savedFiles = Array.from(fileInput.files || []);
            }
        });
    }

    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    let pendingDeleteId = null;

    function openConfirm(projectId) {
        pendingDeleteId = projectId;
        if (confirmOverlay) confirmOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeConfirm() {
        if (confirmOverlay) confirmOverlay.classList.remove('open');
        document.body.style.overflow = '';
        pendingDeleteId = null;
    }

    if (confirmCancel) confirmCancel.addEventListener('click', closeConfirm);
    if (confirmOverlay) {
        confirmOverlay.addEventListener('click', function(e) {
            if (e.target === confirmOverlay) closeConfirm();
        });
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (pendingDeleteId) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = DELETE_ABOUT_URL_BASE + pendingDeleteId;
                document.body.appendChild(form);
                form.submit();
            }
            closeConfirm();
        });
    }

    const viewerOverlay = document.getElementById('viewerOverlay');
    const viewerClose = document.getElementById('viewerClose');
    const slidesTrack = document.getElementById('slidesTrack');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerDesc = document.getElementById('viewerDesc');
    const viewerTags = document.getElementById('viewerTags');
    const viewerLink = document.getElementById('viewerLink');
    const viewerCounter = document.getElementById('viewerCounter');
    const viewerPrev = document.getElementById('viewerPrev');
    const viewerNext = document.getElementById('viewerNext');

    let currentProjectData = null;
    let currentSlideIndex = 0;
    let isAnimating = false;

    function openViewer(projectData) {
        if (!projectData || !viewerOverlay) return;
        currentProjectData = projectData;
        currentSlideIndex = 0;
        viewerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        buildSlides();
        slidesTrack.style.transition = 'none';
        updateSlidePosition();
        requestAnimationFrame(() => {
            slidesTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        updateInfo();
    }
    window.openViewer = openViewer;

    function closeViewer() {
        if (!viewerOverlay) return;
        viewerOverlay.classList.remove('open');
        document.body.style.overflow = '';
        slidesTrack.innerHTML = '';
        currentProjectData = null;
        isAnimating = false;
    }

    function buildSlides() {
        if (!slidesTrack) return;
        slidesTrack.innerHTML = '';
        if (!currentProjectData || !currentProjectData.media || currentProjectData.media.length === 0) {
            slidesTrack.innerHTML = '<div style="color: rgba(200,180,160,0.3); padding: 2rem; text-align: center; width: 100%;">Нет медиа</div>';
            return;
        }

        const media = currentProjectData.media;
        media.forEach((item) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            const isVideo = item && (item.endsWith('.mp4') || item.endsWith('.webm'));

            if (isVideo) {
                slideDiv.innerHTML = `<video controls playsinline preload="metadata"><source src="${item}" type="video/mp4"></video>`;
            } else {
                slideDiv.innerHTML = `<img src="${item}" alt="${currentProjectData.title}" loading="lazy" />`;
            }
            slidesTrack.appendChild(slideDiv);
        });
    }

    function updateSlidePosition() {
        if (!currentProjectData || !currentProjectData.media || currentProjectData.media.length === 0) return;
        const offset = -currentSlideIndex * 100;
        slidesTrack.style.transform = `translateX(${offset}%)`;
        if (viewerCounter) viewerCounter.textContent = `${currentSlideIndex + 1} / ${currentProjectData.media.length}`;
    }

    function updateInfo() {
        if (!currentProjectData) return;

        if (viewerTitle) viewerTitle.textContent = currentProjectData.title || 'Без названия';
        if (viewerDesc) viewerDesc.textContent = currentProjectData.description || '';
        if (viewerTags) viewerTags.innerHTML = (currentProjectData.tags || []).map(t => `<span>${t}</span>`).join('');

        if (currentProjectData.link && viewerLink) {
            viewerLink.href = currentProjectData.link;
            viewerLink.style.display = 'inline-flex';
        } else if (viewerLink) {
            viewerLink.style.display = 'none';
        }

        const total = currentProjectData.media ? currentProjectData.media.length : 0;
        if (viewerPrev) viewerPrev.style.display = total > 1 ? 'flex' : 'none';
        if (viewerNext) viewerNext.style.display = total > 1 ? 'flex' : 'none';
    }

    function goToSlide(index) {
        if (isAnimating) return;
        if (!currentProjectData || !currentProjectData.media) return;
        const total = currentProjectData.media.length;
        if (total <= 1) return;

        isAnimating = true;
        currentSlideIndex = (index + total) % total;
        updateSlidePosition();

        setTimeout(() => {
            isAnimating = false;
            updateInfo();
        }, 550);
    }

    function nextSlide() {
        if (!currentProjectData) return;
        const total = currentProjectData.media ? currentProjectData.media.length : 0;
        if (total <= 1) return;
        goToSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        if (!currentProjectData) return;
        const total = currentProjectData.media ? currentProjectData.media.length : 0;
        if (total <= 1) return;
        goToSlide(currentSlideIndex - 1);
    }

    if (viewerPrev) viewerPrev.addEventListener('click', prevSlide);
    if (viewerNext) viewerNext.addEventListener('click', nextSlide);
    if (viewerClose) viewerClose.addEventListener('click', closeViewer);

    if (viewerOverlay) {
        viewerOverlay.addEventListener('click', function(e) {
            if (e.target === viewerOverlay) closeViewer();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!viewerOverlay || !viewerOverlay.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') closeViewer();
    });

    const logoBtn = document.getElementById('logoBtn');
    if (logoBtn) {
        logoBtn.addEventListener('click', function() {
            window.location.href = window.INDEX_URL || '/';
        });
    }

    updateAdminUI();
    initCardHandlers();

    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldReinit = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('project-card')) {
                            shouldReinit = true;
                            break;
                        }
                    }
                }
                if (shouldReinit) break;
            }
            if (shouldReinit) {
                setTimeout(() => {
                    initCardHandlers();
                    if (isAdmin) {
                        document.querySelectorAll('.action-buttons').forEach(btn => {
                            btn.classList.add('show');
                            btn.style.display = 'flex';
                        });
                    }
                }, 100);
            }
        });

        const grid = document.getElementById('portfolioGrid');
        if (grid) {
            observer.observe(grid, { childList: true, subtree: true });
        }
    }
})();
