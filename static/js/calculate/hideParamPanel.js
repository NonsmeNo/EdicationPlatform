document.addEventListener('DOMContentLoaded', function () {
    const hideBtn = document.querySelector('.hide-param-btn');
    const parameters = document.querySelector('.parameters');
    const canvas_block = document.querySelector('.canvas');

    hideBtn.addEventListener('click', () => {
        const isHidden = parameters.style.display === 'none';
        parameters.style.display = isHidden ? 'block' : 'none';

        const screenWidth = window.innerWidth;

        if (screenWidth < 1050) {
            canvas_block.style.width = '100%';
        }
    });
});
