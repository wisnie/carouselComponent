const carouselContainer = document.querySelector('.carousel__container');
const images = document.querySelectorAll('.carousel__image');

export const generateSlide = image => {
    const div = document.createElement('div');
    div.appendChild(image);
    div.classList.add('carousel__slide');
    carouselContainer.appendChild(div);
};

images.forEach(image => generateSlide(image));
