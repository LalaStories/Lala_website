/* ============================================================
   LALA Kids — Bedtime Storytelling Website
   Interactive Animations & Scroll Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. STAR PARTICLE GENERATOR — Hero Section
  // ============================================================
  function createStars(container, count) {
    const el = document.getElementById(container);
    if (!el) return;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.opacity = Math.random() * 0.7 + 0.3;
      star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      el.appendChild(star);
    }
  }

  createStars('heroStars', 120);
  createStars('ctaStars', 60);

  // ============================================================
  // 2. FLOATING PARTICLE GENERATOR — Hero Particles
  // ============================================================
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 5 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
      particle.style.setProperty('--delay', `${Math.random() * 5}s`);
      container.appendChild(particle);
    }
  }

  createParticles();

  // ============================================================
  // 3. SCROLL-TRIGGERED ANIMATIONS — Intersection Observer
  // ============================================================
  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once animated
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  scrollElements.forEach((el) => observer.observe(el));

  // ============================================================
  // 4. HEADER — Scroll styling (glassmorphism on scroll)
  // ============================================================
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // initial check

  // ============================================================
  // 5. MOBILE MENU — Hamburger toggle
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============================================================
  // 6. SMOOTH SCROLL — For all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ============================================================
  // 7. PARALLAX EFFECT — Subtle depth on hero elements
  // ============================================================
  const heroMoon = document.getElementById('heroMoon');
  const heroImage = document.getElementById('heroImage');

  function handleParallax() {
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero').offsetHeight;

    if (scrollY < heroHeight) {
      const factor = scrollY / heroHeight;

      if (heroMoon) {
        heroMoon.style.transform = `translateY(${factor * 40}px) scale(${1 - factor * 0.15})`;
      }

      if (heroImage) {
        heroImage.style.transform = `translateY(${Math.sin(Date.now() / 800) * 12 + factor * 20}px)`;
      }
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ============================================================
  // 8. STORY CARD — Hover tilt effect (micro-interaction)
  // ============================================================
  document.querySelectorAll('.story-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `translateY(-12px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
    });
  });

  // ============================================================
  // 9. COUNTER ANIMATION — Hero stats count up
  // ============================================================
  function animateCounters() {
    const stats = document.querySelectorAll('.hero-stat-number');
    stats.forEach((stat) => {
      const text = stat.textContent;
      const match = text.match(/([\d.]+)/);
      if (!match) return;

      const target = parseFloat(match[1]);
      const suffix = text.replace(match[1], '');
      const isDecimal = text.includes('.');
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        if (isDecimal) {
          stat.textContent = current.toFixed(1) + suffix;
        } else {
          stat.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters when hero is visible
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(animateCounters, 800);
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  // ============================================================
  // 10. FLOATING SPARKLES — Random sparkle effects on CTA buttons
  // ============================================================
  function addSparkles(button) {
    button.addEventListener('mouseenter', () => {
      for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('span');
        sparkle.textContent = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = `${Math.random() * 12 + 8}px`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle 0.8s ease-in-out forwards';
        sparkle.style.animationDelay = `${Math.random() * 0.3}s`;
        button.style.position = 'relative';
        button.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1200);
      }
    });
  }

  const ctaBtn = document.getElementById('ctaBtn');
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  const navCta = document.querySelector('.nav-cta');
  if (ctaBtn) addSparkles(ctaBtn);
  if (heroCtaBtn) addSparkles(heroCtaBtn);
  if (navCta) addSparkles(navCta);

  // ============================================================
  // 11. APP SECTION — Background dot generator
  // ============================================================
  function createAppDots() {
    const container = document.getElementById('appBgDots');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.classList.add('app-bg-dot');
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.setProperty('--dot-dur', `${Math.random() * 4 + 3}s`);
      dot.style.setProperty('--dot-delay', `${Math.random() * 5}s`);
      const size = Math.random() * 4 + 4;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      container.appendChild(dot);
    }
  }

  createAppDots();

  // ============================================================
  // 12. QR POPUP — Scroll-triggered download popup
  // ============================================================
  const qrPopup = document.getElementById('qrPopup');
  const qrOverlay = document.getElementById('qrOverlay');
  const qrClose = document.getElementById('qrClose');
  let qrShown = false;
  let qrDismissed = sessionStorage.getItem('qrDismissed') === 'true';

  function showQrPopup() {
    if (qrShown || qrDismissed || !qrPopup) return;
    qrShown = true;
    qrPopup.classList.add('active');
    qrOverlay.classList.add('active');
  }

  function hideQrPopup() {
    if (!qrPopup) return;
    qrPopup.classList.remove('active');
    qrOverlay.classList.remove('active');
    qrDismissed = true;
    sessionStorage.setItem('qrDismissed', 'true');
  }

  // Show when user scrolls past 60% of the page
  function checkQrScroll() {
    if (qrDismissed || qrShown) return;
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent > 0.6) {
      showQrPopup();
    }
  }

  window.addEventListener('scroll', checkQrScroll, { passive: true });

  // Close popup
  if (qrClose) qrClose.addEventListener('click', hideQrPopup);
  if (qrOverlay) qrOverlay.addEventListener('click', hideQrPopup);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrPopup && qrPopup.classList.contains('active')) {
      hideQrPopup();
    }
  });

  // ============================================================
  // 13. 3D PHONE CAROUSEL — App showcase section
  // ============================================================
  (function initAppCarousel() {
    const stage   = document.getElementById('appCarouselStage');
    const cards   = stage ? Array.from(stage.querySelectorAll('.app-phone-card')) : [];
    const dotBtns = Array.from(document.querySelectorAll('#appCarouselDots .app-dot'));
    const prevBtn = document.getElementById('appArrowPrev');
    const nextBtn = document.getElementById('appArrowNext');
    const labelEl = document.getElementById('appCarouselLabel');

    if (!stage || !cards.length) return;

    const LABELS = ['Home Screen', 'Enchanted Forest', 'Sparkling Sea', 'Castle in Clouds'];
    let current  = 0;
    let autoPlay;

    function goTo(idx) {
      const n      = (idx + cards.length) % cards.length;
      const prevI  = (n - 1 + cards.length) % cards.length;
      const nextI  = (n + 1) % cards.length;

      cards.forEach((c, i) => {
        c.classList.remove('active', 'card-prev', 'card-next', 'card-hidden');
        if      (i === n)     c.classList.add('active');
        else if (i === prevI) c.classList.add('card-prev');
        else if (i === nextI) c.classList.add('card-next');
        else                  c.classList.add('card-hidden');
      });

      dotBtns.forEach((d, i) => d.classList.toggle('active', i === n));

      if (labelEl) {
        labelEl.style.opacity = '0';
        setTimeout(() => { labelEl.textContent = LABELS[n]; labelEl.style.opacity = '1'; }, 180);
      }

      current = n;
    }

    function advance(dir) { goTo(current + dir); }

    function resetAuto() {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => advance(1), 3500);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { advance(1);  resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { advance(-1); resetAuto(); });

    dotBtns.forEach(d =>
      d.addEventListener('click', () => { goTo(+d.dataset.idx); resetAuto(); })
    );

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('active')) { goTo(i); resetAuto(); }
      });
    });

    // Swipe support
    const wrapper = document.getElementById('appCarouselWrapper');
    if (wrapper) {
      let tx = 0;
      wrapper.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
      wrapper.addEventListener('touchend',   e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) { advance(d > 0 ? 1 : -1); resetAuto(); }
      }, { passive: true });
    }

    // 3D mouse-tilt on active frame only
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        if (!card.classList.contains('active')) return;
        const fr   = card.querySelector('.app-phone-frame');
        if (!fr) return;
        const r    = fr.getBoundingClientRect();
        const mx   = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const my   = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        fr.style.animation = 'none';
        fr.style.transform = `rotateY(${mx * 12}deg) rotateX(${-my * 9}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        const fr = card.querySelector('.app-phone-frame');
        if (!fr) return;
        fr.style.transform = '';
        if (card.classList.contains('active')) {
          fr.style.animation = 'phoneTilt 8s ease-in-out infinite';
        }
      });
    });

    goTo(0);
    resetAuto();
  })();

});
