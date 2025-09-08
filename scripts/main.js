document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (window.scrollY > 0) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });

    // modals
    const modals = document.querySelectorAll('.modal_overlay');
    const btnModals = document.querySelectorAll('[data-modal-btn]');


    btnModals.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.getAttribute('data-modal-btn'))
        })
    })


    modals.forEach(modal => {
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
            if (modal.getAttribute('data-modal') === 'menu') {
                closeModal(modal);
            }
        });

    });

    function openModal(id) {
        modals.forEach(modal => {
            modal.classList.remove('is-open')
            if (modal.getAttribute('data-modal') === id) {
                modal.classList.add('is-open');
                setTimeout(() => {
                     document.body.style.overflow = 'hidden';
                }, 100);
               
            }
        });
    }

    function closeModal(modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Функция для форматирования чисел
    function formatNumber(num) {
        if (num.toString().length <= 4) return num.toString();
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function isElementInViewport(el, threshold = 0.1) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
    }

    function animateCounters() {
        const counterAnimArr = document.querySelectorAll('.counter-anim');

        counterAnimArr.forEach(counter => {
            // const originalWidth = counter.offsetWidth;
            // counter.style.minWidth = originalWidth  + 'px';

            const signElement = counter.nextElementSibling;
            if (signElement && signElement.classList.contains('counter-anim__sign')) {
                signElement.style.opacity = '0';
                signElement.style.transition = 'all 1s ease-out';
                signElement.style.transform = 'translateX(-10px)';
                counter.setAttribute('data-sign', 'true');
            }

            const originalText = counter.textContent;
            const cleanNumber = parseInt(originalText.replace(/\s/g, ''), 10);
            counter.setAttribute('data-original', cleanNumber);

            counter.textContent = '0';
        });

        function startCounterAnimation() {
            counterAnimArr.forEach(counter => {
                if (counter.hasAttribute('data-animated')) return;

                if (isElementInViewport(counter)) {
                    const originalValue = parseInt(counter.getAttribute('data-original'), 10);
                    const speed = parseInt(counter.getAttribute('data-speed')) || 2;
                    const totalDuration = speed * 1000;
                    const startTime = performance.now();


                    const fastEndValue = Math.max(0, originalValue - 5);
                    const fastDuration = totalDuration * 0.7;
                    const slowDuration = totalDuration * 0.3;

                    counter.setAttribute('data-animated', 'true');

                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;

                        if (elapsedTime < totalDuration) {
                            let currentValue;

                            if (elapsedTime < fastDuration) {
                                const progress = elapsedTime / fastDuration;
                                currentValue = Math.floor(progress * fastEndValue);
                            } else {
                                const slowElapsed = elapsedTime - fastDuration;
                                const slowProgress = Math.min(slowElapsed / slowDuration, 1);
                                const slowValue = Math.floor(slowProgress * 5);
                                currentValue = Math.min(fastEndValue + slowValue, originalValue);
                            }

                            counter.textContent = formatNumber(currentValue);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = formatNumber(originalValue);
                            counter.style.minWidth = '';

                            if (counter.getAttribute('data-sign') === 'true') {
                                const signElement = counter.nextElementSibling;
                                if (signElement && signElement.classList.contains('counter-anim__sign')) {
                                    setTimeout(() => {
                                        signElement.style.opacity = '1';
                                        signElement.style.transform = 'translateX(0)'
                                    }, 300);
                                }
                            }
                        }
                    }

                    requestAnimationFrame(updateCounter);
                }
            });
        }

        const scrollHandler = () => requestAnimationFrame(startCounterAnimation);
        window.addEventListener('scroll', scrollHandler);
        window.addEventListener('load', scrollHandler);

        requestAnimationFrame(startCounterAnimation);
    }

    animateCounters();
    const schemeSwipers = document.querySelectorAll('.schemeSwiper');

    schemeSwipers.forEach(swiperElement => {
        new Swiper(swiperElement, {
            slidesPerView: 'auto',
            spaceBetween: 20,

            scrollbar: {
                el: '.custom-scrollbar',
                draggable: true,
                snapOnRelease: true,
                hide: false
            },
            mousewheel: {
                enabled: true,
                forceToAxis: true
            },
            resistance: true,
            resistanceRatio: 0.6
        });
    });


    const swiperProduct = new Swiper('.productSwiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,


        mousewheel: {
            enabled: true,
            forceToAxis: true
        },
        resistance: true,
        resistanceRatio: 0.6
    });




    const phoneInputs = document.querySelectorAll('.phone-input');
    if (phoneInputs.length) {
        phoneInputs.forEach(input => {
            var iti = window.intlTelInput(input, {
                nationalMode: true,
                initialCountry: 'auto',
                geoIpLookup: function (callback) {
                    jQuery.get('https://ipinfo.io', function () { }, 'jsonp').always(function (resp) {
                        var countryCode = resp && resp.country ? resp.country : 'us';
                        callback(countryCode);
                    });
                },
                utilsScript: './scripts/utils.js',
                preferredCountries: ['ru']
            });
            var handleChange = function () {
                var text = iti.isValidNumber() ? iti.getNumber() : '';
                iti.setNumber(text);
                input.value = text;
            };
            input.addEventListener('mouseleave', handleChange);
            input.addEventListener('change', handleChange);
        });
    }
    function validateName(name) {
        name = name.trim();
        return name.length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\- ]+$/.test(name);
    }
    function validateEmail(email) {
        if (!email) return false; // Проверка на пустое значение

        // Удаляем пробелы в начале и конце
        email = email.trim();

        // Регулярное выражение для проверки email
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Дополнительные проверки
        if (email.length > 254) return false; // Максимальная длина email
        if (email.indexOf('..') !== -1) return false; // Две точки подряд
        if (email.indexOf('@') === -1) return false; // Должен быть символ @

        // Разделяем на локальную часть и домен
        const parts = email.split('@');
        if (parts.length !== 2) return false;

        const local = parts[0];
        const domain = parts[1];

        // Проверка длины локальной части и домена
        if (local.length > 64) return false;
        if (domain.length > 253) return false;

        return re.test(email.toLowerCase());
    }
    function showError(input, message) {
        const label = input.closest('.input_label');
        label.scrollIntoView({ block: 'center', behavior: 'smooth' });
        const errorMsg = label.querySelector('.error_msg');
        if (!errorMsg) {
            const errSpan = document.createElement('span');
            errSpan.classList.add('error_msg');
                 errSpan.textContent = message;
        
           
            label.appendChild(errSpan)
        } else {
            errorMsg.textContent = message;
        }
        label.classList.add('error');


    }
    document.querySelectorAll('form').forEach(form => {
        form.noValidate = true; // Отключаем стандартную валидацию

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isFormValid = true;

            // Проверка всех обязательных полей
            const requiredInputs = this.querySelectorAll('input[required], textarea[required], select[required]');

            requiredInputs.forEach(input => {
                // Проверка на пустое значение
                if (!input.value.trim()) {
                    showError(input, input.getAttribute('data-error') || '*Это поле обязательно для заполнения');
                    isFormValid = false;
                } else {
                    clearError(input);
                }
            });

            // Дополнительные проверки
            const nameInput = this.querySelector('input[name="name"]');
            if (nameInput && !validateName(nameInput.value)) {
                showError(nameInput, '*ошибка ввода имени');
                isFormValid = false;
            }
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !validateEmail(emailInput.value)) {
                showError(emailInput, '*Некорректный email-адрес');
                isFormValid = false;
            }
            // Если форма валидна, отправляем
            if (isFormValid) {
                if (form.querySelector('.success_form__content')) {
                    form.classList.add('success_form');
                }

                // Здесь можно добавить отправку формы, если нужно
                // form.submit();
            }
        });

        // Валидация при вводе и изменении
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.addEventListener('input', function () {
                    if (this.value.trim()) {
                        clearError(this);
                    }
                });
            }
        });
    });



    function clearError(input) {
        const errorMsg = input.closest('.input_label')?.querySelector('.error_msg');
        if (errorMsg) {
            input.closest('.input_label').classList.remove('error');
        }
    }
});

