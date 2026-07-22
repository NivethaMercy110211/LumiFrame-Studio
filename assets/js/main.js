/* ==========================================================================
   LumiFrame Studio - Main Application Controller
   Sticky Navigation, Mobile Hamburger Drawer, Active Link Highlighting,
   Scroll Animations, Resize-aware nav behaviour
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── Sticky Header Scroll Effect ───
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  // ─── Active Navigation Highlighting ───
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Strip query strings for comparison
    const hrefBase = href ? href.split('?')[0] : '';
    if (hrefBase === currentPath || (currentPath === '' && hrefBase === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // ─── Mobile Navigation Drawer Toggle ───
  const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeDrawerBtns = document.querySelectorAll('.close-drawer-btn');
  const backdrop = document.querySelector('.nav-backdrop');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Focus first link in drawer for accessibility
    const firstLink = drawer.querySelector('a, button');
    if (firstLink) setTimeout(() => firstLink.focus(), 50);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
    // Return focus to hamburger button
    const btn = document.querySelector('.hamburger-btn');
    if (btn) btn.focus();
  }

  hamburgerBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  closeDrawerBtns.forEach(btn => btn.addEventListener('click', closeDrawer));
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when a nav link is clicked (SPA-style nav or same-page)
  if (drawer) {
    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // On window resize: close drawer if viewport becomes desktop width (>= 1200px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1200 && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }, { passive: true });

  // ─── Automated & Modern Scroll Animation Controller ───
  const setupAutoAnimations = () => {
    // Footer columns & bottom bar
    const footerCols = document.querySelectorAll('.site-footer .row > div');
    footerCols.forEach((col, idx) => {
      if (!col.className.includes('animate-')) {
        col.classList.add('animate-fade-up', `delay-${(idx % 4) + 1}`);
      }
    });

    const footerBottom = document.querySelector('.site-footer .footer-bottom');
    if (footerBottom && !footerBottom.className.includes('animate-')) {
      footerBottom.classList.add('animate-fade-up', 'delay-2');
    }

    // Banner elements
    const bannerItems = document.querySelectorAll('.banner-subtitle, .banner-title, .banner-lead, .banner-cta-group, .banner-breadcrumb');
    bannerItems.forEach((item, idx) => {
      if (!item.className.includes('animate-')) {
        item.classList.add('animate-fade-up', `delay-${(idx % 4) + 1}`);
      }
    });

    // CTA Sections
    const ctaBlocks = document.querySelectorAll('.section-padding.position-relative.overflow-hidden .col-lg-8');
    ctaBlocks.forEach(block => {
      if (!block.className.includes('animate-')) {
        block.classList.add('animate-fade-up');
      }
    });

    // Grid columns staggered reveal
    const cardRows = document.querySelectorAll('.row');
    cardRows.forEach(row => {
      const children = Array.from(row.children);
      children.forEach((child, idx) => {
        if ((child.classList.contains('col') || child.className.includes('col-')) && child.classList.contains('animate-fade-up')) {
          if (!child.className.includes('delay-')) {
            child.classList.add(`delay-${(idx % 4) + 1}`);
          }
        }
      });
    });
  };

  setupAutoAnimations();

  // Immediately reveal all hero banner elements above the fold so content is instantly visible on load
  const heroBannerElements = document.querySelectorAll('.site-banner .animate-fade-up, .site-banner .animate-fade-down, .site-banner .animate-zoom-in, .site-banner .animate-blur-in, .site-banner .animate-slide-left, .site-banner .animate-slide-right');
  heroBannerElements.forEach(el => el.classList.add('animate-visible'));

  // Observe all remaining animated elements below the fold
  const animSelector = '.animate-fade-up, .animate-fade-down, .animate-zoom-in, .animate-blur-in, .animate-slide-left, .animate-slide-right';
  const animElements = document.querySelectorAll(animSelector);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    animElements.forEach(el => el.classList.add('animate-visible'));
  } else if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '50px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animElements.forEach(el => observer.observe(el));
  } else {
    animElements.forEach(el => el.classList.add('animate-visible'));
  }

  // ─── Prevent body scroll behind open modal ───
  // Utility: lock/unlock scroll
  window.lockScroll = () => { document.body.style.overflow = 'hidden'; };
  window.unlockScroll = () => { document.body.style.overflow = ''; };
});
