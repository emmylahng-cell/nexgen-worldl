/* =============================================
   NEXGEN WORLD — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── THEME ─── */
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const saved     = localStorage.getItem('nexgen-theme') || 'dark';

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('nexgen-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  setTheme(saved);
  themeBtn.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ─── LOADER ─── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 2000);
  });
  // Fallback
  setTimeout(() => loader.classList.add('hidden'), 3500);

  /* ─── NAVBAR ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    allLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  /* ─── HERO CANVAS ─── */
  const canvas  = document.getElementById('heroCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.a  = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${this.a})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,162,39,${0.08 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  resizeCanvas();
  initParticles();
  animateCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  /* ─── REVEAL ON SCROLL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ─── COUNTERS ─── */
  const counters   = document.querySelectorAll('.counter');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      let current  = 0;
      const step   = target / 60;
      const tick   = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(tick); }
        el.textContent = Math.floor(current);
      }, 25);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));

  /* ─── PORTFOLIO FILTER ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portCards  = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ─── FAQ ─── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── CONTACT FORM ─── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      shakeForm(); return;
    }
    if (!validateEmail(email)) {
      shakeForm(); return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      form.reset();
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1600);
  });

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function shakeForm() {
    form.style.animation = 'none';
    form.offsetHeight; // reflow
    form.style.animation = 'shake 0.4s ease';
  }

  // Inject shake keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);

  /* ─── BACK TO TOP ─── */
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 400);
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── SMOOTH SCROLLING (for older browsers) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── GLOBE INTERACTIVE ─── */
  const globeWrap = document.querySelector('.hero-globe-wrap');
  if (globeWrap) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      globeWrap.style.transform = `translateY(-50%) rotate3d(${-dy}, ${dx}, 0, ${Math.sqrt(dx*dx+dy*dy)*8}deg)`;
    });
  }

  /* ─── NAV LINK UNDERLINE SLIDE ─── */
  // Tiny line that slides under nav items on hover
  const navBar = document.getElementById('navbar');
  const navLinkEls = document.querySelectorAll('.nav-links .nav-link:not(.nav-cta)');
  let indicator = document.createElement('div');
  indicator.style.cssText = `
    position:absolute; bottom:0; height:2px;
    background:var(--gold); border-radius:2px;
    transition: left .3s cubic-bezier(.16,1,.3,1), width .3s cubic-bezier(.16,1,.3,1), opacity .3s;
    opacity:0; pointer-events:none;
  `;
  const navUl = document.getElementById('navLinks');
  navUl.style.position = 'relative';
  navUl.appendChild(indicator);

  navLinkEls.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const rect     = link.getBoundingClientRect();
      const ulRect   = navUl.getBoundingClientRect();
      indicator.style.left    = (rect.left - ulRect.left) + 'px';
      indicator.style.width   = rect.width + 'px';
      indicator.style.opacity = '1';
    });
    link.addEventListener('mouseleave', () => {
      indicator.style.opacity = '0';
    });
  });

  /* ─── STAGGERED SERVICE CARD ENTRANCE ─── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });

  /* ─── SCROLL PROGRESS BAR ─── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed; top:0; left:0; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--gold-light));
    z-index:9999; width:0%; transition:width .1s;
    pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  });

});
