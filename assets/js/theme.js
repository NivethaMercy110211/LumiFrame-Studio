/* ==========================================================================
   LumiFrame Studio - Theme Toggle Controller (Instant Flicker-Free Transition)
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumiframe_theme';

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, disableTransition = false) {
    if (disableTransition) {
      document.documentElement.classList.add('theme-switching');
    }

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update Theme Toggle Buttons Icon
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #authThemeToggle');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('title', 'Switch to Light Mode');
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('title', 'Switch to Dark Mode');
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      }
    });

    if (disableTransition) {
      // Force instant repaint then remove temporary transition lock
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.documentElement.classList.remove('theme-switching');
        });
      });
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  // Apply immediately before DOM render to prevent theme flash
  applyTheme(getSavedTheme(), false);

  // Attach click listener on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme(), false);

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle-btn, #authThemeToggle');
      if (toggleBtn) {
        e.preventDefault();
        toggleTheme();
      }
    });
  });
})();
