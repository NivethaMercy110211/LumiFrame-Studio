/* ==========================================================================
   LumiFrame Studio - RTL / LTR Direction Toggle Controller
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumiframe_dir';

  function getSavedDir() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);

    // Update RTL Toggle Buttons Text/Icon
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      const span = btn.querySelector('.rtl-label');
      if (span) {
        span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    applyDir(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyDir(getSavedDir());

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDir();
      });
    });
  });
})();
