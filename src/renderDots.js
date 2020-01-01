const slides = document.querySelectorAll('.carousel__slide');
const slidesCounter = slides.length;

const dotsNav = document.querySelector('.dotsNav');

export const renderDots = slidesCounter => {
    for (let counter = 0; counter < slidesCounter; counter++) {
        const dot = document.createElement('div');
        dot.classList.add('dotsNav__dot');
        dotsNav.appendChild(dot);
    }
};

renderDots(slidesCounter);
