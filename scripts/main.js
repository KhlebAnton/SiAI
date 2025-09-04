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
                document.body.style.overflow = 'hidden';
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
                
                // Определяем точку перехода к медленной анимации (последние 5 чисел)
                const fastEndValue = Math.max(0, originalValue - 5);
                const fastDuration = totalDuration * 0.7; // 70% времени на быструю часть
                const slowDuration = totalDuration * 0.3; // 30% времени на медленную часть
                
                counter.setAttribute('data-animated', 'true');

                function updateCounter(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    
                    if (elapsedTime < totalDuration) {
                        let currentValue;
                        
                        if (elapsedTime < fastDuration) {
                            // Быстрая часть анимации
                            const progress = elapsedTime / fastDuration;
                            currentValue = Math.floor(progress * fastEndValue);
                        } else {
                            // Медленная часть - последние 5 чисел
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


 const swiper = new Swiper('.schemeSwiper', {
                slidesPerView: 'auto',
                spaceBetween: 15,
                
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

