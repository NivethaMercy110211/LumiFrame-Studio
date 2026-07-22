/* ==========================================================================
   LumiFrame Studio - Booking Form & Interactive Validation Controller
   Touch-friendly validation, responsive success toast notification
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Handle Date Availability Form & Enquiry Forms
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const group = input.closest('.form-group') || input.parentElement;
        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });

      form.classList.add('was-validated');

      if (isValid) {
        showSuccessToast(form);
      }
    });

    // Clear error states on input change (better UX)
    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group') || input.parentElement;
        if (input.value.trim()) {
          if (group) group.classList.remove('has-error');
        }
      });
    });
  });

  function showSuccessToast(form) {
    const isBooking = form.id === 'bookingForm';
    const title = isBooking ? 'Booking Request Submitted!' : 'Thank You!';
    const message = isBooking
      ? 'Your date availability request has been received. Our studio concierge will contact you within 24 hours to confirm your preferred session time.'
      : 'Your message has been sent successfully. We will get back to you shortly.';

    // Remove any existing toast first
    const existing = document.querySelector('.booking-success-toast');
    if (existing) existing.remove();

    // Create responsive toast element
    const toast = document.createElement('div');
    toast.className = 'booking-success-toast';

    // Responsive positioning: center-bottom on mobile, bottom-right on desktop
    const isMobile = window.innerWidth < 600;
    toast.style.cssText = `
      position: fixed;
      ${isMobile
        ? 'bottom: 16px; left: 12px; right: 12px; width: auto;'
        : 'bottom: 30px; right: 30px; max-width: 420px; width: 420px;'
      }
      background: linear-gradient(135deg, #C5A059, #D4AF37);
      color: #FFFFFF;
      padding: 18px 22px;
      border-radius: 14px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.35);
      z-index: 9999;
      font-family: 'Montserrat', sans-serif;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    `;

    toast.innerHTML = `
      <div style="display:flex; align-items:flex-start; gap:14px;">
        <i class="bi bi-check-circle-fill" style="font-size:1.5rem; flex-shrink:0; margin-top:2px;"></i>
        <div style="flex:1; min-width:0;">
          <h5 style="font-family:'Playfair Display', Georgia, serif; font-size:1.1rem; margin:0 0 4px; font-weight:700; line-height:1.2;">${title}</h5>
          <p style="font-size:0.82rem; margin:0; line-height:1.45; opacity:0.95; overflow-wrap:break-word;">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer; flex-shrink:0; padding:0; margin-top:-2px; opacity:0.8;" aria-label="Close notification">×</button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });
    });

    // Auto dismiss after 5.5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 5500);

    form.reset();
    form.classList.remove('was-validated');
  }
});
