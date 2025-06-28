document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error-input');
        let errorMsg = this.parentElement.querySelector('.error-msg');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
});

document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.block-error').style.display = 'none';
    });
});