export const renderDots = (slidesCounter, parentElement) => {
    for (let counter = 0; counter < slidesCounter; counter++) {
        const dot = document.createElement('div');
        dot.classList.add('dotsNav__dot');
        parentElement.appendChild(dot);
    }
};
