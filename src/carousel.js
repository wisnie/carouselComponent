import './renderButton';
import './renderSlides';
import './renderDots';
import './animateSlides';
import './renderPageBackground';
import { renderSwitch } from './renderSwitch';

const DEFAULT_ACTIVE__DOT = 0;

let slides = document.querySelectorAll('.carousel__slide');
let dots = document.querySelectorAll('.dotsNav__dot');
let elementWidth = slides[0].offsetWidth;
let isInTransition = false;
let activeDot = DEFAULT_ACTIVE__DOT;

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

const deleteOldActiveSlide = () => {
    const previousActiveElement = carouselContainer.querySelector(
        '.carousel__slide--active'
    );
    if (previousActiveElement) {
        previousActiveElement.classList.remove('carousel__slide--active');
    }
};

const updateCurrentActiveSlide = slides => {
    const middleElement = (maxCountOnScreen + 1) / 2;
    const activeElement = slides[middleElement];
    activeElement.classList.add('carousel__slide--active');
};

const setActiveSlide = slides => {
    deleteOldActiveSlide();
    updateCurrentActiveSlide(slides);
};

const updateActiveDotCounter = direction => {
    if (direction === 'left') {
        activeDot = activeDot === 0 ? slidesCounter - 1 : activeDot - 1;
    } else if (direction === 'right') {
        activeDot = activeDot === slidesCounter - 1 ? 0 : activeDot + 1;
    }
};

const deleteOldActiveDot = () => {
    const previousActiveDot = document.querySelector('.dotsNav__dot--active');
    if (previousActiveDot) {
        previousActiveDot.classList.remove('dotsNav__dot--active');
    }
};

const addCurrentActiveDot = () => {
    dots[activeDot].classList.add('dotsNav__dot--active');
};

const updateDots = () => {
    deleteOldActiveDot();
    addCurrentActiveDot();
};

const setActiveDot = direction => {
    updateActiveDotCounter(direction);
    updateDots();
};

const updateSlideOrder = () => {
    slides = carouselContainer.querySelectorAll('.carousel__slide');
};

const setAcitveElements = (slides, direction) => {
    setActiveSlide(slides);
    setActiveDot(direction);
};

const moveToDirection = direction => {
    if (!isInTransition) {
        changeCarouselChildrenOrder(direction);
        updateSlideOrder();
        moveCarousel(slides, elementWidth);
        setAcitveElements(slides, direction);
    }
};

const moveAfterTransitionRight = () => {
    moveToDirection('right');
    carouselContainer.removeEventListener(
        'transitionend',
        moveAfterTransitionRight
    );
};

const moveAfterTransitionLeft = () => {
    moveToDirection('left');
    carouselContainer.removeEventListener(
        'transitionend',
        moveAfterTransitionLeft
    );
};

const checkMultipliersDiffrence = slide => {
    // It is an integer that specifies the multiplier for the style 'left' to the beginning of the middle element.
    // For example, the first visible element has this multiplier set to 0, because its 'left' style is the result of (multiplier * elementWidth), which is 0.
    const activeElementMultiplier = Math.trunc(maxCountOnScreen / 2);
    // Subtraction of active multiplier from current clicked slide multiplier.
    const subtractionOfMultipliers =
        parseFloat(slide.style.left) / elementWidth - activeElementMultiplier;
    return subtractionOfMultipliers;
};

const isApplicableForAddingClass = slide => {
    return checkMultipliersDiffrence(slide) === 0;
};

const isApplicableForMove = slide => {
    return checkMultipliersDiffrence(slide) !== 0;
};

const isOneMove = multipliersDiffrence => {
    return multipliersDiffrence < 2 && multipliersDiffrence > -2;
};

const moveOnce = multipliersDiffrence => {
    if (multipliersDiffrence > 0) {
        moveToDirection('right');
    } else {
        moveToDirection('left');
    }
};

const moveTwice = multipliersDiffrence => {
    moveOnce(multipliersDiffrence);
    if (multipliersDiffrence > 0) {
        carouselContainer.addEventListener(
            'transitionend',
            moveAfterTransitionRight
        );
    } else {
        carouselContainer.addEventListener(
            'transitionend',
            moveAfterTransitionLeft
        );
    }
};

const moveInProperDirection = slide => {
    const multipliersDiffrence = checkMultipliersDiffrence(slide);
    if (isOneMove(multipliersDiffrence)) {
        moveOnce(multipliersDiffrence);
    } else {
        moveTwice(multipliersDiffrence);
    }
};

const isActive = slide => {
    return slide.classList.contains('carousel__slide--scale');
};

const removeActiveClass = () => {
    carouselContainer
        .querySelector('.carousel__slide--scale')
        .classList.remove('carousel__slide--scale');
    pageBackground.classList.remove('pageBackground--scale');
};

const addActiveClass = slide => {
    slide.classList.add('carousel__slide--scale');
    pageBackground.classList.add('pageBackground--scale');
};

const toggleActiveClass = slide => {
    isInTransition = true;
    if (isActive(slide)) {
        removeActiveClass();
    } else {
        addActiveClass(slide);
    }
};

const addClickEventsOnSlide = slide => {
    slide.addEventListener('click', () => {
        if (isApplicableForMove(slide)) {
            moveInProperDirection(slide);
        } else if (isApplicableForAddingClass(slide)) {
            toggleActiveClass(slide);
        }
    });
};

const addCustomSlideClickEvents = slides => {
    slides.forEach(slide => addClickEventsOnSlide(slide));
};

addCustomSlideClickEvents(slides);

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

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xStart = null;
let yStart = null;

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
setAcitveElements(slides);

window.addEventListener('resize', () => {
    window.location.href = '';
});
