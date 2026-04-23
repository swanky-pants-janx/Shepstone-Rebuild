const header = document.querySelector('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

const treatmentsToggle = document.getElementById('treatments-toggle');
const treatmentsDropdown = document.getElementById('treatments-dropdown');

if (treatmentsToggle && treatmentsDropdown) {
    treatmentsToggle.addEventListener('click', (e) => {
        e.preventDefault();
        treatmentsDropdown.classList.toggle('open');
        treatmentsToggle.closest('.has-dropdown').classList.toggle('dropdown-open');
    });
}

// --- Bottom menu sliding pill ---
(function () {
    const container = document.querySelector('.bottom-menu-container');
    if (!container) return;

    const links = Array.from(container.querySelectorAll('a'));
    const activeLink = container.querySelector('a.active');
    if (!activeLink) return;

    // Insert the pill element
    const pill = document.createElement('span');
    pill.className = 'tab-pill';
    container.insertBefore(pill, container.firstChild);

    function pillRect(el) {
        return { left: el.offsetLeft, width: el.offsetWidth };
    }

    function placePill(el, animate) {
        const { left, width } = pillRect(el);
        if (!animate) pill.classList.add('no-transition');
        pill.style.left = left + 'px';
        pill.style.width = width + 'px';
        if (!animate) {
            // force reflow then re-enable transitions
            pill.getBoundingClientRect();
            pill.classList.remove('no-transition');
        }
    }

    const stored = sessionStorage.getItem('tabPillFrom');

    if (stored !== null) {
        // Snap pill to "from" position, then animate to active
        const fromIndex = parseInt(stored, 10);
        sessionStorage.removeItem('tabPillFrom');
        const fromEl = links[fromIndex];
        if (fromEl) {
            placePill(fromEl, false);
            // Small delay lets the browser paint the snap position first
            requestAnimationFrame(() => requestAnimationFrame(() => placePill(activeLink, true)));
        } else {
            placePill(activeLink, false);
        }
    } else {
        placePill(activeLink, false);
    }

    // On each link click, store current active index before navigating
    links.forEach((link, i) => {
        link.addEventListener('click', () => {
            const currentIndex = links.indexOf(activeLink);
            sessionStorage.setItem('tabPillFrom', currentIndex);
        });
    });

    // Scroll active tab into view on mobile
    activeLink.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
})();

// Animate dividers left-to-right on scroll into view
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.divider').forEach(el => observer.observe(el));
})();

// Falling flowers animation for Mother's Day banner
(function () {
    const container = document.getElementById('banner-flowers');
    if (!container) return;

    const flowerSVG = (size) => `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="22" rx="11" ry="20" transform="rotate(0 50 50)"/>
            <ellipse cx="50" cy="22" rx="11" ry="20" transform="rotate(72 50 50)"/>
            <ellipse cx="50" cy="22" rx="11" ry="20" transform="rotate(144 50 50)"/>
            <ellipse cx="50" cy="22" rx="11" ry="20" transform="rotate(216 50 50)"/>
            <ellipse cx="50" cy="22" rx="11" ry="20" transform="rotate(288 50 50)"/>
            <circle cx="50" cy="50" r="9"/>
        </svg>`;

    const count = 28;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'banner-flower';

        const size = Math.random() * 10 + 8;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * -6;

        el.style.left = left + '%';
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.animationDuration = duration + 's';
        el.style.animationDelay = delay + 's';
        el.innerHTML = flowerSVG(size);

        container.appendChild(el);
    }
})();
