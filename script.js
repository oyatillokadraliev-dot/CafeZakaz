document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. PRELOADER (Исчезновение через 1.3 сек)
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1300);
  }

  // ==========================================
  // 2. БУРГЕР-МЕНЮ С АНИМАЦИЕЙ КРЕСТИКА
  // ==========================================
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navLinks.classList.toggle('open');
      body.classList.toggle('no-scroll');
    });

    // Автоматическое закрытие меню при клике на пункт навигации
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('open');
        body.classList.remove('no-scroll');
      });
    });
  }

  // ==========================================
  // 3. ПЛАВНЫЙ СКРОЛЛ С ОФСЕТОМ 72PX (Высота хедера)
  // ==========================================
  const headerHeight = 72;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. HEADER ЭФФЕКТЫ ПРИ СКРОЛЛЕ (> 60px)
  // ==========================================
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 5. SCROLL REVEAL АНИМАЦИИ (.reveal -> .visible)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Анимация срабатывает один раз
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 6. АНИМАЦИЯ СЧЁТЧИКА ГОСТЕЙ (ПРИ ПОЯВЛЕНИИ)
  // ==========================================
  const countElement = document.getElementById('count-guests');
  if (countElement) {
    const startCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      let count = 0;
      const speed = target / 60; // Анимация длится ~1 секунду (60 кадров)

      const updateCount = () => {
        count += speed;
        if (count < target) {
          el.innerText = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = target;
        }
      };
      updateCount();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(countElement);
  }

  // ==========================================
  // 7. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР МЯСА ДЛЯ БАНКЕТА
  // ==========================================
  const slider = document.getElementById('guest-slider');
  const guestCount = document.getElementById('guest-count');
  const meatWeight = document.getElementById('meat-weight');

  if (slider && guestCount && meatWeight) {
    slider.addEventListener('input', (e) => {
      const guests = e.target.value;
      guestCount.innerText = guests;
      // Норма расчета: 400 грамм сочного готового шашлыка на одного гостя
      meatWeight.innerText = (guests * 0.4).toFixed(1);
    });
  }

  // ==========================================
  // 8. CANVAS ИСКРЫ С МАНГАЛА (80 ЧАСТИЦ)
  // ==========================================
  const canvas = document.getElementById('sparksCanvas');
  const heroSection = document.getElementById('hero');

  if (canvas && heroSection) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let isHeroVisible = true;

    const maxParticles = 80;
    const particles = [];
    const colors = [
      'rgba(255, 106, 0, ',  // Фирменный оранжевый
      'rgba(212, 175, 55, ',  // Золотой премиум
      'rgba(255, 154, 0, ',  // Огненный янтарный
      'rgba(255, 69, 0, '    // Насыщенный искристый
    ];

    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Класс частицы-искры мангала
    class Spark {
      constructor() {
        this.reset();
        // Рандомизируем высоту, чтобы искры распределились по экрану при первой загрузке
        this.y = Math.random() * canvas.height; 
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 2.2 + 0.4;
        this.speedY = Math.random() * 1.4 + 0.6; // Движение строго снизу вверх
        this.speedX = Math.random() * 0.4 - 0.2;
        this.wobbleSpeed = Math.random() * 0.04 + 0.01; // Мягкое покачивание (wobble-движение)
        this.wobbleRange = Math.random() * 1.2 + 0.4;
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.4;
        this.decay = Math.random() * 0.004 + 0.002; // Скорость растворения в воздухе
      }

      update() {
        this.y -= this.speedY;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobbleAngle) * (this.wobbleRange * 0.1);
        this.alpha -= this.decay;

        // Если искра погасла или улетела за края холста — возрождаем её у мангала (снизу)
        if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        // Радиальное премиум-свечение вокруг каждой огненной точки
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3.5);
        gradient.addColorStop(0, `${this.baseColor}${this.alpha})`);
        gradient.addColorStop(0.3, `${this.baseColor}${this.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Заполнение пула искр
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Spark());
    }

    // Основной цикл отрисовки canvas
    function animate() {
      if (!isHeroVisible) return; // Пауза, если экран проскроллен (экономия ресурсов)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      animationId = requestAnimationFrame(animate);
    }

    // Оптимизация работы через IntersectionObserver
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isHeroVisible = true;
          animate();
        } else {
          isHeroVisible = false;
          cancelAnimationFrame(animationId);
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection);

    // ==========================================
    // 9. МОБИЛЬНЫЙ WOW-ИНТЕРАКТИВ: ИСКРЫ ПРИ КАСАНИИ
    // ==========================================
    const spawnSparks = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const touchX = clientX - rect.left;
      const touchY = clientY - rect.top;

      // Генерируем 6 ярких искр в точке касания пальца владельца
      for (let i = 0; i < 6; i++) {
        const p = particles[Math.floor(Math.random() * particles.length)];
        p.x = touchX;
        p.y = touchY;
        p.alpha = 1.0; 
        p.size = Math.random() * 2.5 + 1; 
        p.speedY = Math.random() * 3 + 1.5; 
        p.speedX = Math.random() * 4 - 2;  // Веерный разлет в стороны
        p.decay = Math.random() * 0.02 + 0.01; 
      }
    };

    // Отслеживание тапов и скролла на смартфонах
    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        spawnSparks(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        spawnSparks(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // ==========================================
    // 10. ВЗРЫВ ИСКР ПРИ НАЖАТИИ НА КНОПКУ МЕНЮ
    // ==========================================
    const btnMenuHero = document.getElementById('btnMenuHero');
    if (btnMenuHero) {
      btnMenuHero.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Эффект поддува воздуха в угли: резкий вылет 30 искр
        for (let i = 0; i < 30; i++) {
          const p = particles[Math.floor(Math.random() * particles.length)];
          p.x = clickX;
          p.y = clickY;
          p.alpha = 1.0;
          p.size = Math.random() * 3 + 1.5;
          p.speedY = Math.random() * 4 + 2;  
          p.speedX = Math.random() * 6 - 3;  
          p.decay = Math.random() * 0.02 + 0.01;
        }
      });
    }

    // ==========================================
    // 11. СЛЕДОВАНИЕ СВЕТА ЗА МЫШКОЙ (ДЛЯ ДЕСКТОПОВ)
    // ==========================================
    const heroGlow = document.getElementById('heroGlow');
    if (heroGlow && window.innerWidth > 1024) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        heroGlow.style.left = `${x}px`;
        heroGlow.style.top = `${y}px`;
      });
    }
  }

  // ==========================================
  // 12. МОБИЛЬНЫЙ ПАРАЛЛАКС КАРТОЧКИ РЕЖИМА РАБОТЫ
  // ==========================================
  const sidebarCard = document.querySelector('.hero-sidebar-card');
  if (sidebarCard) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (window.innerWidth <= 992 && scrollPos < window.innerHeight) {
        sidebarCard.style.transform = `translateY(${scrollPos * 0.12}px)`;
      }
    }, { passive: true });
  }

});