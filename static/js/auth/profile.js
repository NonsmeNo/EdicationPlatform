document.addEventListener('DOMContentLoaded', () => {


// Редактирование данных пользователя
const editButtons = document.querySelectorAll('.edit-btn');


editButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const label = button.closest('.input-group').querySelector('label').textContent.toLowerCase();
        const icon = button.querySelector('img');

        if (input.hasAttribute('readonly')) {
            input.removeAttribute('readonly');
            input.focus();
            
            const val = input.value;
            input.value = '';
            input.value = val;

            icon.src = '/static/img/check.png';
            icon.alt = 'Сохранить';
        } else {
            const value = input.value;

                if (value === '') {
                input.focus();
                return;
            }


            fetch('/update_profile_field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field: label, value: value })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    input.setAttribute('readonly', true);


                    icon.src = '/static/img/pencil.png';
                    icon.alt = 'Редактировать';
                }

                if (label === 'логин') {
                    const profileName = document.querySelector('.profile-name');
                    if (profileName) profileName.textContent = value;
                }
            })
            .catch(err => {
                console.error('Ошибка запроса:', err);
            });
        }
    });
});





// Изменение аватарки
const profileImg = document.getElementById('profile-img');

// Для смены фото создаем скрытый input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    profileImg.src = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append('avatar', file);

    fetch('/upload_avatar', {
        method: 'POST',
        body: formData
    });
});


    document.body.appendChild(fileInput);

    profileImg.addEventListener('click', () => {
        fileInput.click();
    });
});
