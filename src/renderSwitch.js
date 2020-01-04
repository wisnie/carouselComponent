export const renderSwitch = (buttonLeft, buttonRight) => {
    const arrowsSwitch = /* HTML */ `
        <div class="arrows-switch">
            <p class="screen-readers">
                It's switch menu, that allows you to set visibility
            </p>
            <div class="arrows-switch__container">
                <div class="arrows-switch__point"></div>
            </div>
            <p class="arrows-switch__paragraph">ARROWS</p>
        </div>
    `;

    document
        .querySelector('.wrapper')
        .insertAdjacentHTML('afterbegin', arrowsSwitch);

    const arrowsSwitchContainer = document.querySelector(
        '.arrows-switch__container'
    );
    arrowsSwitchContainer.addEventListener('click', () => {
        arrowsSwitchContainer.firstElementChild.classList.toggle(
            'point--active'
        );
        buttonLeft.classList.toggle('button--hidden');
        buttonRight.classList.toggle('button--hidden');
    });
};
