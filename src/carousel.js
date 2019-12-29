import { renderButton } from './renderButton';
import { renderSwitch } from './renderSwitch';
import { generateSlide } from './renderSlides';
import { renderDots } from './renderDots';

const carouselContainer = document.querySelector('.carousel__container');
const images = document.querySelectorAll('.carousel__image');

renderButton('left');
renderButton('right');
const buttonRight = document.querySelector('.button--right');
const buttonLeft = document.querySelector('.button--left');

renderSwitch(buttonLeft, buttonRight);
images.forEach(image => generateSlide(image));

let slides = document.querySelectorAll('.carousel__slide');
let elementWidth = slides[0].offsetWidth;
let isInTransition = false;
let activeDot = 0;
console.log(dots);

const maxCountOnScreen = Math.round(document.body.offsetWidth / elementWidth);
const slidesCounter = slides.length;

renderDots(slidesCounter);

let dots = document.querySelectorAll('.dotsNav__dot');

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
