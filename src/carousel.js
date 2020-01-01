import './renderButton';
import './renderSlides';
import './renderDots';
import './animateSlides';
import { renderSwitch } from './renderSwitch';

const carouselContainer = document.querySelector('.carousel__container');
const buttonRight = document.querySelector('.button--right');
const buttonLeft = document.querySelector('.button--left');
const pageWidth = document.body.offsetWidth;

let slides = document.querySelectorAll('.carousel__slide');
let dots = document.querySelectorAll('.dotsNav__dot');
let elementWidth = slides[0].offsetWidth;
let isInTransition = false;
let activeDot = 0;

const maxCountOnScreen = Math.round(pageWidth / elementWidth);
const slidesCounter = slides.length;

const moveCarousel = (slides, elementWidth) => {
    isInTransition = true;
    slides.forEach((slide, index) => {
        slide.style.left = `${elementWidth * (index - 1)}px`;
    });
};

const setActiveElement = slides => {
    const middleElement = (maxCountOnScreen + 1) / 2;
    const activeElement = slides[middleElement];
    const previousActiveElement = carouselContainer.querySelector(
        '.carousel__slide--active'
    );
    const previousActiveDot = document.querySelector('.dotsNav__dot--active');

    if (previousActiveElement) {
        previousActiveElement.classList.remove('carousel__slide--active');
    }
    activeElement.classList.add('carousel__slide--active');

    if (previousActiveDot) {
        previousActiveDot.classList.remove('dotsNav__dot--active');
    }
    dots[activeDot].classList.add('dotsNav__dot--active');
};

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

renderSwitch(buttonLeft, buttonRight);
moveCarousel(slides, elementWidth);
setActiveElement(slides);
