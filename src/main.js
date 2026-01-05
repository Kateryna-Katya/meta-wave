document.addEventListener('DOMContentLoaded', () => {
    // 1. РЕГИСТРАЦИЯ ПЛАГИНОВ
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // 2. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 3. ПЛАВНЫЙ СКРОЛЛ (Lenis)
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. МОБИЛЬНОЕ МЕНЮ (С исправлением закрытия)
    const burger = document.getElementById('burger-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    if (burger && menuOverlay) {
        // Открытие/закрытие по клику на бургер
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            menuOverlay.classList.toggle('is-active');
            body.style.overflow = menuOverlay.classList.contains('is-active') ? 'hidden' : '';
        });

        // ЗАКРЫТИЕ ПРИ КЛИКЕ НА ЛЮБУЮ ССЫЛКУ В МЕНЮ
        const menuLinks = menuOverlay.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-active');
                menuOverlay.classList.remove('is-active');
                body.style.overflow = ''; // Возвращаем скролл
            });
        });
    }

    // 5. АНИМАЦИЯ HERO (Слова не разрываются + Градиент)
    const heroTitleText = document.querySelector('#hero-title');
    if (heroTitleText) {
        // types: 'words, chars' — критично для сохранения целостности слов
        const split = new SplitType(heroTitleText, { types: 'words, chars' });

        const tl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1 }
        });

        gsap.set(['.hero__badge', '.hero__description', '.hero__actions', '.btn'], {
            opacity: 1,
            visibility: 'visible'
        });

        tl.from('.hero__badge', { y: 30, opacity: 0, delay: 0.2 })
          .from(split.chars, {
              y: 50,
              opacity: 0,
              stagger: 0.02,
              duration: 0.8
          }, "-=0.6")
          .from('.hero__description', { y: 20, opacity: 0 }, "-=0.7")
          .from('.hero__actions .btn', {
              y: 20,
              opacity: 0,
              stagger: 0.2
          }, "-=0.7");
    }

    // 6. АНИМАЦИЯ ВОЛНЫ
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

    // 7. ИНТЕРАКТИВНЫЕ КАРТОЧКИ (Tilt)
    const cards = document.querySelectorAll('.benefit-card, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 12;
            const rotateY = (rect.width / 2 - x) / 12;

            card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--y', `${(y / rect.height) * 100}%`);

            gsap.to(card, { rotateX, rotateY, duration: 0.5 });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        });
    });

    // 8. КОНТАКТНАЯ ФОРМА
    const initForm = () => {
        const form = document.getElementById('career-form');
        const captchaLabel = document.getElementById('captcha-question');
        const captchaInput = document.getElementById('captcha-input');
        const phoneInput = document.getElementById('phone');
        const successMessage = document.getElementById('form-success');

        if (!form || !captchaLabel) return;

        let n1 = Math.floor(Math.random() * 9) + 1;
        let n2 = Math.floor(Math.random() * 9) + 1;
        let correctAnswer = n1 + n2;
        captchaLabel.textContent = `${n1} + ${n2} =`;

        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d+]/g, '');
            });
        }

        form.onsubmit = (e) => {
            e.preventDefault();
            if (parseInt(captchaInput.value) !== correctAnswer) {
                alert('Капча решена неверно!');
                return;
            }
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.innerHTML = 'Отправка...';
            setTimeout(() => {
                successMessage.classList.add('is-active');
            }, 1000);
        };
    };
    initForm();

    // 9. КУКИ
    const initCookies = () => {
        const popup = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!popup || !acceptBtn) return;
        if (!localStorage.getItem('cookies-accepted')) {
            setTimeout(() => popup.classList.add('is-active'), 2000);
        }
        acceptBtn.onclick = () => {
            localStorage.setItem('cookies-accepted', 'true');
            popup.classList.remove('is-active');
        };
    };
    initCookies();

    // 10. ЭФФЕКТ ХЕДЕРА
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) header.classList.add('header--scroll');
        else header.classList.remove('header--scroll');
    });
});