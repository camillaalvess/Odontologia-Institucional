/* ============================================================
   Dr. Rafael Mendes — Clínica Odontológica Premium
   script.js — Vanilla JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. HEADER STICKY =====
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  // ===== 2. MENU MOBILE =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active', menuOpen);
    nav.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Fechar ao clicar em link
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (menuOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });


  // ===== 3. SCROLL SUAVE =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ===== 4. ANIMAÇÕES AO SCROLL (REVEAL) =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Atraso escalonado para grupos de elementos
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Adicionar delays escalonados a grupos de cards
  const staggerGroups = [
    '.servicos__grid .servico-card',
    '.depoimentos__grid .depoimento-card',
    '.diferenciais__right .diferencial',
    '.metrics__grid .metric',
    '.antes-depois__grid .antes-depois__item',
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.delay = i * 100;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  // ===== 5. CONTADORES ANIMADOS =====
  const counters = document.querySelectorAll('.metric__num');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const isDecimal = el.classList.contains('metric__num--decimal');
    const duration = 2000;
    const step = 16;
    const steps = duration / step;
    const increment = target / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      // Easing: desaceleração no final
      const progress = count / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = target * eased;

      if (isDecimal) {
        el.textContent = (current / 10).toFixed(1);
      } else {
        el.textContent = Math.floor(current).toLocaleString('pt-BR');
      }

      if (count >= steps) {
        clearInterval(timer);
        if (isDecimal) {
          el.textContent = (target / 10).toFixed(1);
        } else {
          el.textContent = target.toLocaleString('pt-BR');
        }
      }
    }, step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));


  // ===== 6. FAQ ACORDEÃO =====
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Fechar todos
      faqItems.forEach(i => {
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq__answer').classList.remove('open');
      });

      // Abrir o clicado (se estava fechado)
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  // ===== 7. SLIDER ANTES & DEPOIS =====
  const comparisons = document.querySelectorAll('.comparison-wrap');

  comparisons.forEach(wrap => {
    const after = wrap.querySelector('.comparison-after');
    const slider = wrap.querySelector('.comparison-slider');
    let isDragging = false;
    let currentPercent = 50;

    const setPosition = (percent) => {
      const clamped = Math.min(Math.max(percent, 5), 95);
      currentPercent = clamped;
      after.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      slider.style.left = `${clamped}%`;
    };

    const getPercent = (e) => {
      const rect = wrap.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    };

    // Mouse events
    wrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(getPercent(e));
      wrap.style.cursor = 'col-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(getPercent(e));
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      wrap.style.cursor = '';
    });

    // Touch events
    wrap.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(getPercent(e));
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(getPercent(e));
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Hover rápido para demonstração
    wrap.addEventListener('mouseenter', () => {
      if (!isDragging) {
        animateDemo(wrap, after, slider, currentPercent);
      }
    });
  });

  // Demonstração animada ao hover
  function animateDemo(wrap, after, slider, startPercent) {
    const target = startPercent > 50 ? 30 : 70;
    const duration = 600;
    const start = performance.now();
    const from = startPercent;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * ease;

      after.style.clipPath = `inset(0 ${100 - current}% 0 0)`;
      slider.style.left = `${current}%`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }


  // ===== 8. PARALLAX SUAVE NO HERO =====
  const heroBgText = document.querySelector('.hero__bg-text');

  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.15}px))`;
      }
    }, { passive: true });
  }


  // ===== 9. ACTIVE LINK NA NAVEGAÇÃO =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--blue)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => activeLinkObserver.observe(section));


  // ===== 10. BOTÃO WHATSAPP FLUTUANTE — APARECER APÓS SCROLL =====
  const waFloat = document.querySelector('.whatsapp-float');

  if (waFloat) {
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'scale(0.8)';
    waFloat.style.transition = 'opacity .4s ease, transform .4s ease, box-shadow .3s ease';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        waFloat.style.opacity = '1';
        waFloat.style.transform = 'scale(1)';
      } else {
        waFloat.style.opacity = '0';
        waFloat.style.transform = 'scale(0.8)';
      }
    }, { passive: true });
  }


  console.log('✦ Dr. Rafael Mendes — Landing Page carregada com sucesso!');
});