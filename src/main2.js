window.addEventListener('load', () => {
    const carousel = document.querySelector('.carousel');

    const buttonLeft = document.createElement('button');
    buttonLeft.classList.add('button');
    buttonLeft.classList.add('button--left');
    buttonLeft.insertAdjacentHTML(
        'afterbegin',
        '<svg class="container__svg" style="width:24px;height:24px" viewBox="0 0 24 24"><path class="container__path" fill="#000000" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg> <p class="screen-readers">Left button for moving photos.</p>'
    );

    carousel.appendChild(buttonLeft);

    const buttonRight = document.createElement('button');
    buttonRight.classList.add('button');
    buttonRight.classList.add('button--right');
    buttonRight.insertAdjacentHTML(
        'afterbegin',
        '<svg class="container__svg" style="width:24px;height:24px" viewBox="0 0 24 24"><path class="container__path" fill="#000000"  d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg> <p class="screen-readers">Right button for moving photos.</p>'
    );
    carousel.appendChild(buttonRight);

    const arrowsSwitch = document.querySelector('.arrows-switch');

    const arrowsSwitchContainer = document.createElement('div');
    arrowsSwitchContainer.classList.add('arrows-switch__container');

    const arrowsSwitchPoint = document.createElement('div');
    arrowsSwitchPoint.classList.add('arrows-switch__point');
    arrowsSwitchContainer.appendChild(arrowsSwitchPoint);

    const arrowsSwitchParagraph = document.createElement('p');
    arrowsSwitchParagraph.classList.add('arrows-switch__paragraph');
    arrowsSwitchParagraph.textContent = 'ARROWS';

    arrowsSwitch.appendChild(arrowsSwitchContainer);
    arrowsSwitch.appendChild(arrowsSwitchParagraph);

    arrowsSwitchContainer.addEventListener('click', () => {
        arrowsSwitchContainer.firstElementChild.classList.toggle(
            'point--active'
        );
        buttonLeft.classList.toggle('button--hidden');
        buttonRight.classList.toggle('button--hidden');
    });

    const carouselContainer = document.querySelector('.carousel__container');
    const dotsNav = document.querySelector('.dotsNav');

    const generateSlide = image => {
        const div = document.createElement('div');
        div.appendChild(image);
        div.classList.add('carousel__slide');
        carouselContainer.appendChild(div);
    };

    const images = document.querySelectorAll('.carousel__image');
    images.forEach(image => generateSlide(image));

    let slides = document.querySelectorAll('.carousel__slide');
    let elementWidth = slides[0].offsetWidth;
    let isInTransition = false;
    let dots;
    let activeDot = 0;
    const maxCountOnScreen = Math.round(
        document.body.offsetWidth / slides[0].offsetWidth
    );

    const slidesCounter = slides.length;

    const createDots = slidesCounter => {
        for (let counter = 0; counter < slidesCounter; counter++) {
            const dot = document.createElement('div');
            dot.classList.add('dotsNav__dot');
            dotsNav.appendChild(dot);
        }
        dots = document.querySelectorAll('.dotsNav__dot');
    };

    createDots(slidesCounter);

    const moveCarousel = (slides, elementWidth) => {
        isInTransition = true;
        slides.forEach((slide, index) => {
            slide.style.left = `${elementWidth * (index - 1)}px`;
        });
    };

    const setActiveElement = slides => {
        const middleElement = (maxCountOnScreen + 1) / 2;
        let activeElement = slides[middleElement];

        if (carouselContainer.querySelector('.carousel__slide--active')) {
            carouselContainer
                .querySelector('.carousel__slide--active')
                .classList.remove('carousel__slide--active');
        }
        activeElement.classList.add('carousel__slide--active');

        if (document.querySelector('.dotsNav__dot--active')) {
            document
                .querySelector('.dotsNav__dot--active')
                .classList.remove('dotsNav__dot--active');
        }
        dots[activeDot].classList.add('dotsNav__dot--active');
    };

    moveCarousel(slides, elementWidth);
    setActiveElement(slides);

    slides.forEach(slide => {
        slide.animate(
            [
                // keyframes
                { opacity: '0' },
                { opacity: '1' }
            ],
            {
                // timing options
                duration: 500,
                delay: 400,
                iterations: 1,
                fill: 'both'
            }
        );
    });

    const moveToRight = () => {
        if (isInTransition) {
            return;
        }
        carouselContainer.appendChild(carouselContainer.firstElementChild);
        slides = carouselContainer.querySelectorAll('.carousel__slide');
        moveCarousel(slides, elementWidth);
        activeDot === slidesCounter - 1 ? (activeDot = 0) : activeDot++;
        setActiveElement(slides);
    };

    const moveToLeft = () => {
        if (isInTransition) {
            return;
        }
        carouselContainer.prepend(carouselContainer.lastElementChild);
        slides = carouselContainer.querySelectorAll('.carousel__slide');
        moveCarousel(slides, elementWidth);
        activeDot === 0 ? (activeDot = slidesCounter - 1) : activeDot--;
        setActiveElement(slides);
    };

    buttonRight.addEventListener('click', () => {
        moveToRight();
    });

    buttonLeft.addEventListener('click', () => {
        moveToLeft();
    });

    document.addEventListener('keydown', e => {
        if (e.keyCode === 37) {
            moveToLeft();
        } else if (e.keyCode === 39) {
            moveToRight();
        }
    });

    carouselContainer.addEventListener('transitionend', () => {
        isInTransition = false;
    });

    const moveAfterTransitionRight = () => {
        carouselContainer.removeEventListener(
            'transitionend',
            moveAfterTransitionRight
        );
        moveToRight();
    };

    const moveAfterTransitionLeft = () => {
        carouselContainer.removeEventListener(
            'transitionend',
            moveAfterTransitionLeft
        );
        moveToLeft();
    };

    const background = document.createElement('div');
    background.classList.add('background');
    document.body.appendChild(background);

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            if (isInTransition) {
                return;
            }
            const multiplierOfMiddleElement = Math.trunc(maxCountOnScreen / 2);
            const moveCounter =
                parseFloat(slide.style.left) / elementWidth -
                multiplierOfMiddleElement;
            if (moveCounter > 0) {
                moveToRight();
                if (moveCounter === 2) {
                    carouselContainer.addEventListener(
                        'transitionend',
                        moveAfterTransitionRight
                    );
                }
            } else if (moveCounter < 0) {
                moveToLeft();
                if (moveCounter === -2) {
                    carouselContainer.addEventListener(
                        'transitionend',
                        moveAfterTransitionLeft
                    );
                }
            }
        });
        slide.addEventListener('click', () => {
            if (isInTransition) {
                return;
            }
            if (
                slide.classList.contains('carousel__slide--active') &&
                !slide.classList.contains('carousel__slide--scale')
            ) {
                isInTransition = true;
                slide.classList.add('carousel__slide--scale');
                background.classList.add('background--scale');
            } else if (slide.classList.contains('carousel__slide--scale')) {
                carouselContainer
                    .querySelector('.carousel__slide--scale')
                    .classList.remove('carousel__slide--scale');
                background.classList.remove('background--scale');
            }
        });
    });

    background.addEventListener('click', () => {
        if (isInTransition) {
            return;
        }
        if (carouselContainer.querySelector('.carousel__slide--scale')) {
            carouselContainer
                .querySelector('.carousel__slide--scale')
                .classList.remove('carousel__slide--scale');
            background.classList.remove('background--scale');
        }
    });

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    let xStart = null;

    function handleTouchStart(event) {
        const touches = event.touches[0];
        xStart = touches.clientX;
    }

    function handleTouchMove(event) {
        if (!yStart || !xStart) {
            return;
        }
        const xNow = event.touches[0].clientX;
        const xDirection = xStart - xNow;

        if (xDirection > 30) {
            moveToLeft();
        } else if (xDirection < -30) {
            moveToRight();
        }
    }
});
