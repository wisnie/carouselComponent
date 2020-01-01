const carousel = document.querySelector('.carousel');

const buttonSvg = {
    right:
        '<svg class="container__svg" style="width:24px;height:24px" viewBox="0 0 24 24"><path class="container__path" fill="#000000"  d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>',
    left:
        '<svg class="container__svg" style="width:24px;height:24px" viewBox="0 0 24 24"><path class="container__path" fill="#000000" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>'
};

const renderButton = side => {
    const button = /* HTML */ `
        <button class="button button--${side}">
            ${buttonSvg[side]}
            <p class="screen-readers">${side} button for moving photos.</p>
        </button>
    `;
    carousel.insertAdjacentHTML('beforeend', button);
};

renderButton('left');
renderButton('right');
