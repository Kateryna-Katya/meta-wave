document.addEventListener('DOMContentLoaded', () => {
  // 1. Регистрация плагинов
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  // 2. Инициализация иконок
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // 3. Плавный скролл
  const lenis = new Lenis();
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 4. Мобильное меню
  const burger = document.getElementById('burger-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  if (burger && menuOverlay) {
      burger.addEventListener('click', () => {
          burger.classList.toggle('is-active');
          menuOverlay.classList.toggle('is-active');
          document.body.style.overflow = menuOverlay.classList.contains('is-active') ? 'hidden' : '';
      });
  }

  // 5. Анимация Hero (Безопасный метод)
  const heroTitleText = document.querySelector('#hero-title');

  if (heroTitleText) {
      // Сначала разбиваем текст
      const split = new SplitType(heroTitleText, { types: 'chars' });

      // Создаем таймлайн
      const tl = gsap.timeline({
          defaults: { ease: "expo.out", duration: 1 }
      });

      // Сбрасываем возможные невидимости перед стартом
      gsap.set(['.hero__badge', '.hero__description', '.hero__actions', '.btn'], {
          opacity: 1,
          visibility: 'visible'
      });

      // Запускаем последовательность
      tl.from('.hero__badge', { y: 30, opacity: 0 })
        .from(split.chars, {
            y: 50,
            opacity: 0,
            stagger: 0.03,
            duration: 0.8
        }, "-=0.5")
        .from('.hero__description', { y: 20, opacity: 0 }, "-=0.6")
        .from('.hero__actions .btn', {
            y: 20,
            opacity: 0,
            stagger: 0.2
        }, "-=0.6");
  }

  // 6. Анимация волны (MotionPath)
  if (document.querySelector(".wave-path")) {
      gsap.to(".wave-dot", {
          motionPath: {
              path: ".wave-path",
              align: ".wave-path",
              alignOrigin: [0.5, 0.5]
          },
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
      });
  }
  // 9. ИНТЕРАКТИВНЫЕ КАРТОЧКИ (Tilt + Glow)
  const cards = document.querySelectorAll('.benefit-card');

  cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Расчет углов наклона (макс 10 градусов)
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          // Обновляем CSS переменные для "блика" (glow)
          card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
          card.style.setProperty('--y', `${(y / rect.height) * 100}%`);

          // Применяем трансформацию через GSAP для плавности
          gsap.to(card, {
              rotateX: rotateX,
              rotateY: rotateY,
              duration: 0.5,
              ease: "power2.out"
          });
      });

      // Сброс при выходе мыши
      card.addEventListener('mouseleave', () => {
          gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.5)"
          });
      });
  });

  // Анимация появления сетки карточек
  gsap.from(".benefit-card", {
      scrollTrigger: {
          trigger: ".benefits__grid",
          start: "top 80%"
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
  });
});