/* ==========================================================================
   LumiFrame Studio - Portfolio Gallery & Lightbox Controller
   Filter Logic & Modal Lightbox with Prev/Next/Close & Keyboard Support
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Category Filtering Logic
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Lightbox Modal Functionality
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxSub = lightbox.querySelector('.lightbox-subtitle');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev-btn');
  const nextBtn = lightbox.querySelector('.lightbox-next-btn');

  let galleryArray = [];
  let currentIndex = 0;

  function buildGalleryArray() {
    galleryArray = [];
    const visibleCards = document.querySelectorAll('.portfolio-item:not(.hide) .portfolio-card');
    visibleCards.forEach((card, index) => {
      const img = card.querySelector('img');
      const title = card.querySelector('.portfolio-item-title') ? card.querySelector('.portfolio-item-title').textContent : 'Portrait';
      const tag = card.querySelector('.portfolio-cat-tag') ? card.querySelector('.portfolio-cat-tag').textContent : 'LumiFrame Gallery';
      
      card.setAttribute('data-gallery-index', index);
      galleryArray.push({
        src: img ? img.getAttribute('src') : '',
        title: title,
        subtitle: tag
      });
    });
  }

  function updateLightboxContent(index) {
    if (index < 0 || index >= galleryArray.length) return;
    currentIndex = index;
    const item = galleryArray[currentIndex];

    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxSub) lightboxSub.textContent = item.subtitle;
  }

  function openLightbox(index) {
    buildGalleryArray();
    if (galleryArray.length === 0) return;
    updateLightboxContent(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    const nextIdx = (currentIndex + 1) % galleryArray.length;
    updateLightboxContent(nextIdx);
  }

  function prevImage() {
    const prevIdx = (currentIndex - 1 + galleryArray.length) % galleryArray.length;
    updateLightboxContent(prevIdx);
  }

  // Bind click event to cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.portfolio-card');
    if (card) {
      buildGalleryArray();
      const idx = parseInt(card.getAttribute('data-gallery-index') || 0, 10);
      openLightbox(idx);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  // Close when clicking modal backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
});
