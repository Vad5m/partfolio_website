const preloaderFirst = document.getElementById('preloaderFirst');
const preloaderSecond = document.getElementById('preloaderSecond');

setTimeout(function() {
    preloaderFirst.classList.add('hidden');
    setTimeout(function() {
        preloaderSecond.classList.add('hidden');
    }, 2000);
}, 3000);

setTimeout(function() {
    preloaderFirst.classList.add('hidden');
    setTimeout(function() {
        preloaderSecond.classList.add('hidden');
    }, 2000);
}, 5000);

const professions = ['разработчик', 'дизайнер', 'кодер', 'блогер', 'монтажер', 'мододел'];
let currentIndex = 0;
const wrapper = document.getElementById('professionWrapper');

function rotateProfession() {
    const currentEl = wrapper.querySelector('.profession-slide.active');
    if (!currentEl) return;
    currentEl.classList.remove('active');
    currentEl.classList.add('exit');
    setTimeout(() => {
        currentEl.remove();
        currentIndex = (currentIndex + 1) % professions.length;
        const newEl = document.createElement('span');
        newEl.className = 'profession-slide active';
        newEl.dataset.profession = professions[currentIndex];
        newEl.textContent = professions[currentIndex];
        wrapper.appendChild(newEl);
        wrapper.querySelectorAll('.profession-slide').forEach(el => el.classList.remove('exit'));
    }, 500);
}
setInterval(rotateProfession, 2800);

const track = document.getElementById('carouselTrack');

track.addEventListener('mouseenter', () => track.classList.add('paused'));
track.addEventListener('mouseleave', () => track.classList.remove('paused'));

track.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('mouseenter', () => track.classList.add('paused'));
    card.addEventListener('mouseleave', () => track.classList.remove('paused'));

    card.addEventListener('click', function(e) {
        try {
            const data = JSON.parse(this.dataset.project);
            if (data) {
                window.location.href = "/partfolio?project=" + data.id;
            }
        } catch (err) {
            console.error('Ошибка парсинга данных проекта', err);
        }
    });
});

const widget = document.querySelector(".binary-rings-widget");
const root = widget.querySelector(".binary-rings");

const rings = [
    [40, 18, 18, "normal"],
    [53, 22, 24, "reverse"],
    [66, 26, 34, "normal"],
    [79, 30, 48, "reverse"],
    [92, 34, 66, "normal"],
    [105, 38, 90, "reverse"],
    [118, 42, 120, "normal"],
    [131, 46, 150, "reverse"],
    [144, 50, 180, "normal"]
];

rings.forEach(([r, n, speed, dir]) => {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.cssText = `
        --r: ${r}px;
        --speed: ${speed}s;
        --dir: ${dir};
    `;

    let gap = 0;

    for (let i = 0; i < n; i++) {
        if (gap > 0) {
            gap--;
            continue;
        }

        if (Math.random() < 0.13) {
            gap = 2 + Math.floor(Math.random() * 4);
            continue;
        }

        const bit = document.createElement("span");
        bit.className = "bit";
        bit.textContent = Math.random() < 0.5 ? "0" : "1";
        bit.style.cssText = `
            --a: ${i * 360 / n}deg;
            --r: ${r}px;
        `;

        ring.appendChild(bit);
    }

    root.appendChild(ring);
});

setInterval(() => {
    const bits = [...widget.querySelectorAll(".bit")];
    const chosen = new Set();

    while (chosen.size < Math.min(5, bits.length)) {
        chosen.add(Math.floor(Math.random() * bits.length));
    }

    chosen.forEach(index => {
        const bit = bits[index];
        bit.textContent = bit.textContent === "0" ? "1" : "0";
    });
}, 1000);
