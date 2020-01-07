export const generateSlide = (image, carouselContainer) => {
    const div = document.createElement('div');
    div.appendChild(image);
    div.classList.add('carousel__slide');
    carouselContainer.appendChild(div);
};
