document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.menu-mobile-btn');
    const menu = document.querySelector('.menu');

    // Открытие/закрытие меню
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // Клик по блоку меню как по ссылке
    document.querySelectorAll('.menu-block').forEach(block => {
        block.addEventListener('click', () => {
            const link = block.querySelector('a');
            if (link) {
                window.location.href = link.href;
                menu.classList.remove('active'); // Закрыть меню после клика
            }
        });
    });
});
