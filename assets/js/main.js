document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const rtlToggles = [document.getElementById('rtl-toggle'), document.getElementById('rtl-toggle-mobile')];

    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // ── RTL: restore saved mode first (before any layout paint) ──────────────
    const savedLayout = localStorage.getItem('layout-mode');
    if (savedLayout === 'rtl') {
        document.body.classList.add('rtl-mode');
    } else {
        document.body.classList.remove('rtl-mode');
    }

    // Reveal page now that RTL class is applied → CSS opacity transition fires
    // (html.page-loading was set in <head> IIFE to keep body hidden until ready)
    document.documentElement.classList.remove('page-loading');

    // Sync button labels to match restored state
    const isRtlNow = document.body.classList.contains('rtl-mode');
    rtlToggles.forEach(t => { if (t) t.textContent = isRtlNow ? 'RTL' : 'LTR'; });

    // ── Theme initialization helper ───────────────────────────────────────────
    const updateThemeIcons = (theme) => {
        if (!sunIcon || !moonIcon) return;
        if (theme === 'light') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    // Initial icon state
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeIcons(currentTheme);

    // ── Mobile Navigation Toggle ───────────────────────────────────────────
    const toggleMobileNav = () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        navOverlay.classList.toggle('active');

        // Prevent background scrolling when menu is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileNav);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMobileNav);
    }

    // Mobile Nav Back Button
    const mobileNavBack = document.getElementById('mobile-nav-back');
    if (mobileNavBack) {
        mobileNavBack.addEventListener('click', toggleMobileNav);
    }

    // ── Mobile Dropdown logic ───────────────────────────────────────────────
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.closest('.has-dropdown');
            const menu = parent.querySelector('.mobile-dropdown-menu');
            const icon = toggle.querySelector('.dropdown-icon');

            menu.classList.toggle('active');
            if (icon) {
                icon.style.transform = menu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });

    // Close mobile nav when clicking a link (except toggles)
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a:not(.mobile-dropdown-toggle)');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    // ── Theme toggle ──────────────────────────────────────────────────────────
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    }

    // ── Footer Collapsible logic ──────────────────────────────────────────────
    const footerToggles = document.querySelectorAll('.collapsible-trigger');
    footerToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });

    // ── RTL toggle: persist on click, keep both buttons in sync ──────────────
    rtlToggles.forEach(toggle => {
        if (!toggle) return;
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('rtl-mode');
            const isRtl = document.body.classList.contains('rtl-mode');

            // Persist to localStorage so mode survives navigation and refresh
            localStorage.setItem('layout-mode', isRtl ? 'rtl' : 'ltr');

            // Keep desktop + mobile button labels in sync
            rtlToggles.forEach(t => { if (t) t.textContent = isRtl ? 'RTL' : 'LTR'; });
        });
    });
});
