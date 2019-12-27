const buttonLeft = document.querySelector('.button--left');
const buttonRight = document.querySelector('.button--right');

//Switch

const change = document.querySelector('.switch');

change.addEventListener('click', () => {
    change.firstElementChild.classList.toggle('point--active');
    buttonLeft.classList.toggle('button--hidden');
    buttonRight.classList.toggle('button--hidden');
});

//Carousel

const dots = document.querySelectorAll('.dotsNav__dot');
const carousel = document.querySelector('.carousel__container');

window.addEventListener('load', () => {
    let slides = document.querySelectorAll('.carousel__slide');
    let elementWidth = slides[0].offsetWidth;
    let isInTransition = false;
    //Middle Dot
    let activeDot = 3;

    const moveCarousel = (slides, elementWidth) => {
        isInTransition = true;
        slides.forEach((slide, index) => {
            slide.style.left = `${elementWidth * (index - 1)}px`;
        });
    };

    moveCarousel(slides, elementWidth);

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

    const setActiveElement = slides => {
        const activeElement = slides[3];

        carousel
            .querySelector('.carousel__slide--active')
            .classList.remove('carousel__slide--active');
        //The middle element
        activeElement.classList.add('carousel__slide--active');

        document
            .querySelector('.dotsNav__dot--active')
            .classList.remove('dotsNav__dot--active');
        dots[activeDot].classList.add('dotsNav__dot--active');
    };

    const moveToRight = () => {
        if (isInTransition === true) return;
        carousel.appendChild(carousel.firstElementChild);
        slides = carousel.querySelectorAll('.carousel__slide');
        moveCarousel(slides, elementWidth);
        activeDot === 6 ? (activeDot = 0) : activeDot++;
        setActiveElement(slides);
    };

    const moveToLeft = () => {
        if (isInTransition === true) return;
        carousel.prepend(carousel.lastElementChild);
        slides = carousel.querySelectorAll('.carousel__slide');
        moveCarousel(slides, elementWidth);
        activeDot === 0 ? (activeDot = 6) : activeDot--;
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

    carousel.addEventListener('transitionend', () => {
        isInTransition = false;
    });

    const moveAfterTransitionRight = () => {
        carousel.removeEventListener('transitionend', moveAfterTransitionRight);
        moveToRight();
    };

    const moveAfterTransitionLeft = () => {
        carousel.removeEventListener('transitionend', moveAfterTransitionLeft);
        moveToLeft();
    };

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            //Middle Slide is 3rd position (0,1,2) from left, so we need to subtract two.
            if (isInTransition === true) return;
            const moveCounter = parseInt(slide.style.left) / elementWidth - 2;
            if (moveCounter > 0) {
                // for (let counter = 0; counter < moveCounter; counter++) {
                moveToRight();
                // }
                if (moveCounter === 2) {
                    carousel.addEventListener(
                        'transitionend',
                        moveAfterTransitionRight
                    );
                }
            } else if (moveCounter < 0) {
                moveToLeft();
                if (moveCounter === -2) {
                    carousel.addEventListener(
                        'transitionend',
                        moveAfterTransitionLeft
                    );
                }
            }
        });
    });

    //Swipe Events
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

        if (xDirection > 0) {
            moveToLeft();
        } else if (xDirection < 0) {
            moveToRight();
        }
    }
});
