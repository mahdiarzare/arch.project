document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const SWIPE_THRESHOLD = 40;

  document.querySelectorAll('[data-slider]').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const dotsWrap = slider.querySelector('.slider-dots');
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index + 1); });

    let startX = 0;
    let dragging = false;
    let moved = false;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      moved = false;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 10) moved = true;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > SWIPE_THRESHOLD) goTo(index - 1);
      else if (dx < -SWIPE_THRESHOLD) goTo(index + 1);
    });

    slider.addEventListener('click', (e) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    }, true);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const items = Array.from(document.querySelectorAll('.lightbox-item'));
  let currentIndex = 0;

  function openLightbox(i) {
    currentIndex = i;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = items[currentIndex];
    const img = item.querySelector('img');
    lightboxImage.src = img.getAttribute('src') || '';
    lightboxImage.alt = img.getAttribute('alt') || '';
    lightboxCaption.textContent = img.getAttribute('data-caption') || img.getAttribute('alt') || '';
    lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function showPrev() { currentIndex = (currentIndex - 1 + items.length) % items.length; updateLightbox(); }
  function showNext() { currentIndex = (currentIndex + 1) % items.length; updateLightbox(); }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  let lbStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - lbStartX;
    if (dx > SWIPE_THRESHOLD) showPrev();
    else if (dx < -SWIPE_THRESHOLD) showNext();
  });

});

