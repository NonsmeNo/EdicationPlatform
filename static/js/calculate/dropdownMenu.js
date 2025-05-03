document.addEventListener('DOMContentLoaded', function() {
    function el(id){
        return document.getElementById( id );
    }

    const f1 = el('f1');
    const f2 = el('f2');
    const f3 = el('f3');
    const f4 = el('f4');
    const f5 = el('f5');


    const selectBtn = document.querySelector('.select-btn');
    const dropdown = document.getElementById('dropdown-options');
    const selectTitle = document.querySelector('.select-title');

    selectBtn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Закрыть при клике вне меню
    document.addEventListener('click', (e) => {
        if (!selectBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    document.querySelectorAll('.dropdown-options .option').forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.getAttribute('data-value');
            const text = option.textContent;
            selectTitle.textContent = text;
            dropdown.style.display = 'none';

            // Показ нужного блока
            f1.style.display = (value === 'simple') ? 'block' : 'none';
            f2.style.display = (value === 'param') ? 'block' : 'none';
            f3.style.display = (value === 'centre_circle') ? 'block' : 'none';
            f4.style.display = (value === 'centre_ellips') ? 'block' : 'none';
            f5.style.display = (value === 'focus_ellips') ? 'block' : 'none';
        });
    });

});