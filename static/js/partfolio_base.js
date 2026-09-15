(function() {
    const container = document.getElementById('particles');
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

    const toggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
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

    document.getElementById('logoBtn').addEventListener('click', function() {
        window.location.href = "/";
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const staggerElements = document.querySelectorAll('.stagger-children');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    staggerElements.forEach(el => staggerObserver.observe(el));
})();

console.log('⠄⠄⠄⠄⠄⣸⣿⣮⣝⢱⣶⢵⡚⣽⣵⣿⣦⣝⣄⠄⠄⠄⠄⠄⠄⠄⠄⠄');
console.log('⠄⣤⣤⣦⣝⣙⡩⠭⡍⣿⣷⣶⣼⣦⣭⣝⡻⣿⣶⡢⠄⠄⠄⠄⠄⠄⠄⠄');
console.log('⣾⣿⣿⠫⣰⣿⣿⣿⣧⢽⣿⣿⣿⣿⣿⣿⣿⡜⣿⣿⣅⠄⠄⠄⠄⠄⠄⠄');
console.log('⢿⣿⡿⢰⣿⣿⣿⣿⣿⣷⣮⣛⢿⡿⡿⠿⢻⢡⣜⣿⣿⡼⣤⠄⠄⠄⠄⠄');
console.log('⠈⣿⣧⢻⠟⠛⠻⣿⣿⣿⣿⣿⡆⣷⣿⣿⣿⣧⠳⣿⣿⣿⣿⠂⠄⠄⠄⠄');
console.log('⠄⠘⣿⣞⠄⠺⠄⢸⣿⣿⣿⣿⠇⣾⣿⣿⣿⣿⠄⠈⠻⣿⠟⠄⠄⠄⠄⠄');
console.log('⠄⠄⠸⢿⣷⣔⠶⢿⣿⣿⠿⣋⣾⣿⣿⡻⣿⣿⣷⣤⣤⣄⣀⠄⠄⠄⠄⠄');
console.log('⠄⠄⠄⠄⠉⢻⣿⣗⡦⡠⠚⢿⣿⣿⣿⣿⣜⢿⣿⣿⣿⣿⣿⣷⣤⣀⡀⠄');
console.log('⠄⠄⠄⠄⠄⠈⢺⢿⣿⣿⣿⣷⣮⡛⢿⣿⣿⣿⣿⣿⣿⣿⡿⣻⣿⣿⣿⣦');
console.log('⠄⠄⠄⠄⠄⠄⠄⠁⢻⣿⣿⣿⣿⣧⣛⢿⣿⣿⣾⣿⣿⣿⡇⣿⣿⣿⣿⣿');
console.log('⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠹⠗⡞⠬⠛⠻⠻⣿⣿⣿⣶⡡⣿⣿⣿⣿⣿');
console.log('⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠹⠗⡞⠬⠛⠻⠻⣿⣿⣿⣶⡡⣿⣿⣿⣿⣿');
console.log('⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣴⣿⣿⣿⣿⣿⣷⣮⢻⡛⡧⢓⢹⣿⣿⣿⣿');
console.log('⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣭⢂⠰⠡⢿⣿⣿⣿');
