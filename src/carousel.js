import './renderButton';
import './renderSlides';
import './renderDots';
import './animateSlides';
import './renderPageBackground';
import { renderSwitch } from './renderSwitch';

let slides = document.querySelectorAll('.carousel__slide');
let dots = document.querySelectorAll('.dotsNav__dot');
let elementWidth = slides[0].offsetWidth;
let isInTransition = false;
let activeDot = 0;

const carouselContainer = document.querySelector('.carousel__container');
const carouselRightButton = document.querySelector('.button--right');
const carouselLeftButton = document.querySelector('.button--left');
const pageWidth = document.body.offsetWidth;
const maxCountOnScreen = Math.round(pageWidth / elementWidth);
const slidesCounter = slides.length;
const pageBackground = document.querySelector('.pageBackground');

const moveCarousel = (slides, elementWidth) => {
    isInTransition = true;
    slides.forEach((slide, index) => {
        slide.style.left = `${elementWidth * (index - 1)}px`;
    });
};

const changeCarouselChildrenOrder = direction => {
    if (direction === 'left') {
        carouselContainer.prepend(carouselContainer.lastElementChild);
    } else if (direction === 'right') {
        carouselContainer.appendChild(carouselContainer.firstElementChild);
    }
};

const setActiveSlide = slides => {
    const middleElement = (maxCountOnScreen + 1) / 2;
    const activeElement = slides[middleElement];
    const previousActiveElement = carouselContainer.querySelector(
        '.carousel__slide--active'
    );
    if (previousActiveElement) {
        previousActiveElement.classList.remove('carousel__slide--active');
    }
    activeElement.classList.add('carousel__slide--active');
};

const updateActiveDotCounter = direction => {
    if (direction === 'left') {
        activeDot === 0 ? (activeDot = slides.length - 1) : activeDot++;
    } else if (direction === 'right') {
        activeDot === slidesCounter - 1 ? (activeDot = 0) : activeDot++;
    }
};

const updateDots = () => {
    const previousActiveDot = document.querySelector('.dotsNav__dot--active');
    if (previousActiveDot) {
        previousActiveDot.classList.remove('dotsNav__dot--active');
    }
    dots[activeDot].classList.add('dotsNav__dot--active');
};

const setActiveDot = direction => {
    updateActiveDotCounter(direction);
    updateDots();
};

const setActiveElement = slides => {
    setActiveSlide(slides);
    setActiveDot();
};

const updateSlideOrder = () => {
    slides = carouselContainer.querySelectorAll('.carousel__slide');
};

const moveToDirection = direction => {
    if (!isInTransition) {
        changeCarouselChildrenOrder(direction);
        updateSlideOrder();
        moveCarousel(slides, elementWidth);
        setActiveDot(direction);
        setActiveSlide(slides);
    }
};

const moveAfterTransitionRight = () => {
    carouselContainer.removeEventListener(
        'transitionend',
        moveAfterTransitionRight
    );
    moveToDirection('right');
};

const moveAfterTransitionLeft = () => {
    carouselContainer.removeEventListener(
        'transitionend',
        moveAfterTransitionLeft
    );
    moveToDirection('left');
};

carouselContainer.addEventListener('transitionend', () => {
    isInTransition = false;
});

carouselRightButton.addEventListener('click', () => {
    moveToDirection('right');
});

carouselLeftButton.addEventListener('click', () => {
    moveToDirection('left');
});

document.addEventListener('keydown', e => {
    if (e.keyCode === 37) {
        moveToDirection('left');
    } else if (e.keyCode === 39) {
        moveToDirection('right');
    }
});

slides.forEach(slide => {
    slide.addEventListener('click', () => {
        if (!isInTransition) {
            const multiplierOfMiddleElement = Math.trunc(maxCountOnScreen / 2);
            const moveCounter =
                parseFloat(slide.style.left) / elementWidth -
                multiplierOfMiddleElement;
            if (moveCounter > 0) {
                moveToDirection('right');
                if (moveCounter === 2) {
                    carouselContainer.addEventListener(
                        'transitionend',
                        moveAfterTransitionRight
                    );
                }
            } else if (moveCounter < 0) {
                moveToDirection('left');
                if (moveCounter === -2) {
                    carouselContainer.addEventListener(
                        'transitionend',
                        moveAfterTransitionLeft
                    );
                }
            }
        }
    });
    slide.addEventListener('click', () => {
        if (!isInTransition) {
            if (
                slide.classList.contains('carousel__slide--active') &&
                !slide.classList.contains('carousel__slide--scale')
            ) {
                isInTransition = true;
                slide.classList.add('carousel__slide--scale');
                pageBackground.classList.add('pageBackground--scale');
            } else if (slide.classList.contains('carousel__slide--scale')) {
                carouselContainer
                    .querySelector('.carousel__slide--scale')
                    .classList.remove('carousel__slide--scale');
                pageBackground.classList.remove('pageBackground--scale');
            }
        }
    });
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
        moveToDirection('left');
    } else if (xDirection < -30) {
        moveToDirection('right');
    }
}

pageBackground.addEventListener('click', () => {
    if (!isInTransition) {
        if (carouselContainer.querySelector('.carousel__slide--scale')) {
            carouselContainer
                .querySelector('.carousel__slide--scale')
                .classList.remove('carousel__slide--scale');
            pageBackground.classList.remove('pageBackground--scale');
        }
    }
});

renderSwitch(carouselLeftButton, carouselRightButton);
moveCarousel(slides, elementWidth);
setActiveElement(slides);
