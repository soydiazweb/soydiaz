const body = document.body;
    const btn = document.getElementById('menuBtn');
    const panel = document.getElementById('navPanel');
    const scrim = document.getElementById('scrim');
    const contactPanel = document.getElementById('contactPanel');
    const contactClose = document.querySelector('.contact-close');
    const contactTriggers = document.querySelectorAll('.contact-trigger');

    const toggleMenu = (force) => {
      const open = typeof force === 'boolean' ? force : !body.classList.contains('menu-open');
      if (open) toggleContact(false);
      body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
    };

    const toggleContact = (force) => {
      const open = typeof force === 'boolean' ? force : !body.classList.contains('contact-open');
      if (open) toggleMenu(false);
      body.classList.toggle('contact-open', open);
      contactPanel.setAttribute('aria-hidden', String(!open));
      contactTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(open)));
    };

    btn.addEventListener('click', () => toggleMenu());
    scrim.addEventListener('click', () => {
      toggleMenu(false);
      toggleContact(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleMenu(false);
        toggleContact(false);
      }
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    contactTriggers.forEach(trigger => trigger.addEventListener('click', () => toggleContact()));
    contactClose.addEventListener('click', () => toggleContact(false));
    contactPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleContact(false)));

    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        question.setAttribute('aria-expanded', String(open));
      });
    });

    /* ============================================================
       Dinámica: reveals, progreso, back to top, parallax,
       botones magnéticos, tilt 3D y cursor liquid glass
       ============================================================ */
    document.documentElement.classList.add('js');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    // Barra de progreso de lectura
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    // Reveals al hacer scroll (con stagger por grupo)
    const revealSpec = [
      ['.services .service', true],
      ['.clients h2', false], ['.clients-heading p', false], ['.client', true],
      ['.about h2', false], ['.about-lead', false], ['.about-detail', false],
      ['.personal-gallery h2', false], ['.personal-gallery-heading p', false],
      ['.skills-copy h2', false], ['.skills-copy p', false], ['.skills-copy .cta', false],
      ['.skill', true],
      ['.faq-copy h2', false], ['.faq-copy p', false], ['.faq-copy .cta', false],
      ['.faq-item', true],
      ['.footer-kicker', false], ['.footer-name', false]
    ];
    revealSpec.forEach(([selector, stagger]) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.setAttribute('data-reveal', '');
        if (stagger) el.style.setProperty('--d', `${Math.min(i * 0.08, 0.56)}s`);
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    document.querySelectorAll('.personal-photo').forEach((el, i) => {
      el.style.setProperty('--d', `${Math.min(i * 0.08, 0.56)}s`);
      io.observe(el);
    });

    // Back to top + progreso + parallax multicapa
    const backTop = document.getElementById('backTop');
    const arch = document.querySelector('.portrait .arch');
    const intro = document.querySelector('.intro');
    const seal = document.querySelector('.seal');
    const marquees = document.querySelectorAll('.marquee');
    const photos = document.querySelectorAll('.personal-photo');
    const parallaxOn = !reducedMotion && window.matchMedia('(min-width: 721px)').matches;
    const centerOffset = (el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - window.innerHeight / 2 - (el._py || 0);
    };
    const setParallax = (el, value, asVar) => {
      el._py = value;
      if (asVar) el.style.setProperty('--py', `${value}px`);
      else el.style.transform = `translateY(${value}px)`;
    };
    let scrollTick = false;
    const onScroll = () => {
      const y = window.scrollY;
      backTop.classList.toggle('is-visible', y > 480);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      if (parallaxOn) {
        const hy = Math.min(y, 900);
        if (arch) arch.style.transform = `translateY(${hy * 0.1}px)`;
        if (intro) intro.style.transform = `translateY(${hy * 0.045}px)`;
        if (seal) seal.style.transform = `translateY(${hy * -0.07}px)`;
        marquees.forEach((m, i) => {
          setParallax(m, centerOffset(m) * (i === 0 ? 0.05 : -0.04), false);
        });
        photos.forEach((p, i) => {
          const v = Math.max(-34, Math.min(34, centerOffset(p) * (i % 2 === 0 ? 0.055 : -0.045)));
          setParallax(p, v, true);
        });
      }
      scrollTick = false;
    };
    window.addEventListener('scroll', () => {
      if (!scrollTick) {
        scrollTick = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    // Botones magnéticos
    if (finePointer && !reducedMotion) {
      document.querySelectorAll('.menu-btn, .cta, .back-top').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      });
    }

    // Tilt 3D en fotos personales
    if (finePointer && !reducedMotion) {
      document.querySelectorAll('.personal-photo').forEach((photo) => {
        photo.addEventListener('mousemove', (e) => {
          const r = photo.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          photo.style.setProperty('--ry', `${(px - 0.5) * 7}deg`);
          photo.style.setProperty('--rx', `${(0.5 - py) * 7}deg`);
        });
        photo.addEventListener('mouseleave', () => {
          photo.style.setProperty('--rx', '0deg');
          photo.style.setProperty('--ry', '0deg');
        });
      });
    }

    // Cursor liquid glass
    if (finePointer && !reducedMotion) {
      const dot = document.createElement('div');
      const glass = document.createElement('div');
      dot.className = 'cursor-dot';
      glass.className = 'cursor-glass';
      dot.setAttribute('aria-hidden', 'true');
      glass.setAttribute('aria-hidden', 'true');
      document.body.append(glass, dot);
      document.body.classList.add('custom-cursor');

      let mx = innerWidth / 2, my = innerHeight / 2;
      let gx = mx, gy = my;
      let visible = false;

      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
          visible = true;
          dot.style.opacity = '1';
          glass.style.opacity = '1';
        }
        dot.style.transform = `translate3d(${mx - 3.5}px, ${my - 3.5}px, 0)`;
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        visible = false;
        dot.style.opacity = '0';
        glass.style.opacity = '0';
      });

      const lerpGlass = () => {
        gx += (mx - gx) * 0.16;
        gy += (my - gy) * 0.16;
        const half = glass.offsetWidth / 2;
        glass.style.transform = `translate3d(${gx - half}px, ${gy - half}px, 0)`;
        requestAnimationFrame(lerpGlass);
      };
      requestAnimationFrame(lerpGlass);

      const interactive = 'a, button, .faq-question, .client, .personal-photo, .gallery-card';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactive)) glass.classList.add('is-active');
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactive)) glass.classList.remove('is-active');
      });
    }
