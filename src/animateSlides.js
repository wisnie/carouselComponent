const slides = document.querySelectorAll('.carousel__slide');

const animateSlides = slides => {
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
};

animateSlides(slides);
