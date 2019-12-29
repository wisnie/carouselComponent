const carouselContainer = document.querySelector('.carousel__container');

export const generateSlide = image => {
    const div = document.createElement('div');
    div.appendChild(image);
    div.classList.add('carousel__slide');
    carouselContainer.appendChild(div);
};
