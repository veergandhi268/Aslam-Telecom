/**
 * ASLAM TELECOM - Official Interactive Script
 * Clean, Mobile-Optimized UI with Touch-Friendly Sliders, Modals & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initBeforeAfterSliders();
  initFaqAccordion();
  initBookingModal();
  initTestimonialFilter();
});

// ----------------------------------------------------
// 1. Sticky Header
// ----------------------------------------------------
function initStickyHeader() {
  const header = document.querySelector('.header-sticky');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ----------------------------------------------------
// 2. Mobile Menu Drawer (Smooth, Accessible & Bulletproof)
// ----------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeMobileMenu');

  if (!toggleBtn || !menu) return;

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    menu.classList.add('active');
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    menu.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  });

  // Clicking backdrop outside the drawer content
  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeDrawer();
  });

  // Link handling in mobile drawer
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Check if it's an on-page hash link or same page anchor
      const isCurrentPageHash = href.startsWith('#') || 
        (href.includes('#') && (
          window.location.pathname.endsWith(href.split('#')[0]) ||
          (window.location.pathname.endsWith('/') && href.startsWith('index.html#')) ||
          (window.location.pathname.endsWith('index.html') && href.startsWith('index.html#'))
        ));

      if (isCurrentPageHash) {
        const hashId = href.split('#')[1];
        const targetEl = document.getElementById(hashId);
        if (targetEl) {
          e.preventDefault();
          closeDrawer();
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, `#${hashId}`);
          }, 100);
          return;
        }
      }

      closeDrawer();
    });
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeDrawer();
    }
  });
}

// ----------------------------------------------------
// 3. Smooth Scrolling for Anchor Links
// ----------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      // Handle on-page scroll
      const isIndexPage = window.location.pathname.endsWith('/') || 
                          window.location.pathname.endsWith('index.html') || 
                          window.location.pathname === '';

      if (href.startsWith('#') && isIndexPage) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, href);
        }
      } else if (href.startsWith('index.html#') && isIndexPage) {
        const hash = href.replace('index.html', '');
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, hash);
        }
      }
    });
  });
}

// ----------------------------------------------------
// 4. Touch-Friendly Before / After Comparison Sliders
// ----------------------------------------------------
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.ba-container');

  containers.forEach(container => {
    const range = container.querySelector('.ba-range-input');
    const beforeWrapper = container.querySelector('.ba-image-before-wrapper');
    const handle = container.querySelector('.ba-slider-handle');

    if (!range || !beforeWrapper || !handle) return;

    const setPosition = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      beforeWrapper.style.width = `${clamped}%`;
      handle.style.left = `${clamped}%`;
    };

    // Range input change (keyboard & accessibility)
    range.addEventListener('input', (e) => {
      setPosition(parseFloat(e.target.value));
    });

    // Touch events for ultra-smooth mobile finger sliding
    const handleTouch = (e) => {
      const rect = container.getBoundingClientRect();
      const touchX = e.touches[0].clientX;
      const percent = ((touchX - rect.left) / rect.width) * 100;
      range.value = percent;
      setPosition(percent);
    };

    container.addEventListener('touchstart', handleTouch, { passive: true });
    container.addEventListener('touchmove', handleTouch, { passive: true });

    // Desktop mouse drag
    let isMouseDown = false;
    container.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      const rect = container.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      range.value = percent;
      setPosition(percent);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const rect = container.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      range.value = percent;
      setPosition(percent);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
  });
}

// ----------------------------------------------------
// 5. FAQ Accordion
// ----------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// ----------------------------------------------------
// 6. Booking & Callback Modal
// ----------------------------------------------------
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtn = document.getElementById('closeBookingModal');
  const form = document.getElementById('bookingModalForm');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Customer';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const device = form.querySelector('[name="device"]')?.value || 'Smartphone';
      const issue = form.querySelector('[name="issue"]')?.value || 'Repair';

      const msg = encodeURIComponent(
        `Hi Aslam Telecom! New Repair Booking Request:\n\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `📱 Device: ${device}\n` +
        `🛠 Issue: ${issue}\n` +
        `📍 Store: Shop 15, Municipal Market, Borivali East`
      );

      closeModal();
      window.open(`https://wa.me/919870552602?text=${msg}`, '_blank');
    });
  }
}

// ----------------------------------------------------
// 7. Testimonial Filter Tabs
// ----------------------------------------------------
function initTestimonialFilter() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterBtns.length || !reviewCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      reviewCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
