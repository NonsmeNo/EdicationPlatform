import os
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from werkzeug.utils import secure_filename

from config import Config
from models import db, Users, Themes, Tasks, Templates, SavedTasks




app = Flask(__name__)  
app.config.from_object(Config)


# Инициализация LoginManager
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Настройка user_loader для Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))



# Роуты

@app.route('/')
def index():
    return render_template('index.html', current_path=request.path)


# Авторизация / регистрация 

@app.route('/profile')
def profile():
    user = db.session.get(Users, current_user.get_id())
    if not user:
        return redirect(url_for('login'))
    return render_template('profile.html', current_path=request.path, user=user)

@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        errors = {}
        email = request.form['email'].lower()
        password = request.form['password']

        # Валидация
        # проверка на пустые данные
        if not email:
            errors['email'] = "Поле e-mail не заполнено"
        if not password:
            errors['password'] = "Поле пароль не заполнено"

        if errors:
            return render_template("login.html", errors=errors, email=email)

        user = Users.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('profile'))
        
        # сообщение, если логин и пароль не совпадают
        msg = "Неверный адрес электронной почты или пароль"
        msg_type = "error"
        return render_template("login.html", email=email, msg=msg, msg_type=msg_type)
    else:
        msg = request.args.get('msg', '')
        msg_type = request.args.get('msg_type', '')
        email = request.args.get('email', '')

        return render_template("login.html", msg=msg, msg_type=msg_type, email=email)



@app.route('/register', methods=["POST", "GET"])
def register():
    if request.method == "POST":
        errors = {}
        name = request.form['name']
        email = request.form['email'].lower()
        password = request.form['password']
        password_rep = request.form['password_rep']

        # Валидация
        # проверка на пустые данные
        if not name:
            errors['name'] = "Логин не может быть пустым"
        if not email:
            errors['email'] = "E-mail не может быть пустым"
        if not password:
            errors['password'] = "Пароль не может быть пустым"
        if not password_rep:
            errors['password_rep'] = "Пароли должны совпадать"

        # проверка корректности email
        try:
            validate_email(email)
        except EmailNotValidError:
            errors['email'] = "Введен некорректный e-mail"

        # проверка уникальности email
        existing_user = Users.query.filter_by(email=email).first()
        if existing_user:
            errors['email'] = "Данный e-mail уже используется."

        # проверка совпадения паролей
        if password != password_rep:
            errors['password'] = "Пароли должны совпадать"
            errors['password_rep'] = "Пароли должны совпадать"

        if errors:
            return render_template("register.html", errors=errors, name=name, email=email)

        # запись информации о новом пользователе в бд
        hash = generate_password_hash(password)
        new_user = Users(name=name, email=email, password=hash, img='img/profile.png')
        db.session.add(new_user)
        db.session.commit()

        # сообщение об успешной регистрации
        msg = "Вы успешно зарегистрировались! Пожалуйста, войдите в свою учетную запись."
        msg_type = "success"
        return redirect(url_for('login', msg=msg, msg_type=msg_type, email=email))
    else:
        return render_template("register.html", errors={}, name="", email="")


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


# Профиль

# Изменение фотографии
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload_avatar', methods=['POST'])
@login_required
def upload_avatar():
    print("Current working directory:", os.getcwd())
    print("App root path:", app.root_path)
    
    file = request.files.get('avatar')
    if not file or not allowed_file(file.filename):
        return jsonify({'message': 'Файл не получен или формат не поддерживается'}), 400

    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = secure_filename(f"user_{current_user.id}.{ext}")

    # Абсолютный путь до папки static/img/users внутри проекта
    upload_folder = os.path.join(app.root_path, 'static', 'img', 'users')

    # Создаем папку (если нет)
    os.makedirs(upload_folder, exist_ok=True)

    path = os.path.join(upload_folder, filename)

    file.save(path)

    # Путь, который будет использоваться в шаблонах для загрузки изображения (относительно static)
    current_user.img = f"img/users/{filename}"
    db.session.commit()

    return jsonify({'message': 'Фото обновлено', 'filename': current_user.img})



# Изменение имени/email/пароля
@app.route('/update_profile_field', methods=['POST'])
@login_required
def update_profile_field():
    
    data = request.get_json()
    field = data.get('field')
    value = data.get('value')

    if field == 'логин':
        current_user.name = value
    elif field == 'email':
        current_user.email = value
    elif field == 'пароль':
        # хеширование пароля
        from werkzeug.security import generate_password_hash
        current_user.password = generate_password_hash(value)
    else:
        return jsonify({'status': 'error', 'message': 'Недопустимое поле'}), 400

    db.session.commit()
    return jsonify({'status': 'ok'})


# Графический калькулятор

@app.route('/calculate')
def calculate():
    return render_template('calculate.html', current_path=request.path)



#  Генератор задач

@app.route('/taskThemes')
def task_themes():
    themes = Themes.query.all()
    return render_template('taskThemes.html', current_path=request.path, themes=themes)


    
@app.route('/params', methods=['POST', 'GET'])
def params():
    theme_id = request.args.get('theme_id')
    
    if request.method == "POST":
        task_id = request.form['task_id']
        return redirect(url_for('rend2', task_id=task_id))
    else:
        themes = Themes.query.all()
        current_theme = Themes.query.filter_by(id=theme_id).first()
        templates = Templates.query.filter_by(theme_id=current_theme.id).all()
        saved_tasks = SavedTasks.query.filter_by(user_id=current_user.get_id()).filter_by(
            theme_id=current_theme.id).all()
        return render_template("params.html", current_path='/taskThemes',
                               saved_tasks=saved_tasks, themes=themes, 
                               current_theme=current_theme, templates=templates)



@app.route('/rend')
def rend():
    req = request.args.get('theme_id')
    theme_id = req.split('?')[0]
    template_id = req.split('?')[1].split('=')[1]
    print(theme_id)
    print(template_id)
    current_theme = Themes.query.filter_by(id=theme_id).first()

    current_template = Templates.query.filter_by(id=template_id).first()
    task = Tasks.query.filter_by(theme_id=theme_id).first()
    themes = Themes.query.all()
    return render_template("rend.html", current_path='/taskThemes', current_theme=current_theme, task=task, current_template=current_template, themes=themes)


@app.route('/rendsave')
def rendsave():
    req = request.args.get('theme_id')
    theme_id = req.split('?')[0]
    task_id = req.split('?')[1].split('=')[1]
    print(theme_id)
    print(task_id)
    current_theme = Themes.query.filter_by(id=theme_id).first()

    current_task = SavedTasks.query.filter_by(id=task_id).first()
    task = Tasks.query.filter_by(theme_id=theme_id).first()
    themes = Themes.query.all()
    return render_template("rendSave.html", current_path='/taskThemes', current_theme=current_theme, task=task, current_task=current_task, themes=themes)


@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    task = data.get('task')
    task_template = data.get('task_template')
    task_latex = data.get('latex')
    theme_id = data.get('theme_id')
    template_id = data.get('template_id')
    print(theme_id)

    new_saved_task = SavedTasks(task=task, task_template=task_template, task_latex= task_latex, theme_id=theme_id, user_id=current_user.get_id(), template_id=template_id)
    db.session.add(new_saved_task)
    db.session.commit()

    return jsonify({'message': 'Task added successfully'})




# Создание таблиц в базе данных и заполнение темами и шаблонами

def seed_themes():
    if Themes.query.count() == 0:
        themes = [
            Themes(id=1, name='Линейные уравнения'),
            Themes(id=2, name='Квадратные уравнения'),
            Themes(id=3, name='Тригонометрические уравнения')
        ]
        db.session.add_all(themes)
        db.session.commit()

def seed_templates():
    if Templates.query.count() == 0:
        templates = [
            Templates(template='$@*x$@=$@', template_show='a·x + b = c', template_latex=r'$@\cdot x$@=$@', theme_id=1),
            Templates(template='$@*x=$@', template_show='a·x = b', template_latex=r'$@\cdot x=$@', theme_id=1),
            Templates(template='$@*(x$@)=$@', template_show='a·(x - b) = c', template_latex=r'$@\cdot\left(x$@\right)=$@', theme_id=1),
            Templates(template='$@*x^2$@*x$@=0', template_show='a·x² + b·x + c = 0', template_latex=r'$@\cdot x^2$@\cdot x$@=0', theme_id=2),
            Templates(template='$@*x^2$@*x=0', template_show='a·x² + b·x = 0 ', template_latex=r'$@\cdot x^2$@\cdot x=0', theme_id=2),
            Templates(template='$@*sin(x)$@=$@', template_show='a·sin(x) + b = c', template_latex=r'$@\cdot\sin\left(x\right)$@=$@', theme_id=3),
            Templates(template='$@*cos(x)$@=$@', template_show='a·cos(x) + b = c', template_latex=r'$@\cdot\cos\left(x\right)$@=$@', theme_id=3),
        ]
        db.session.add_all(templates)
        db.session.commit()

def seed_tasks():
    if Tasks.query.count() == 0:
        tasks = [
            Tasks(task_text='Решите линейное уравнение', theme_id=1),
            Tasks(task_text='Решите квадратное уравнение', theme_id=2),
            Tasks(task_text='Решите тригонометрическое уравнение', theme_id=3),
        ]
        db.session.add_all(tasks)
        db.session.commit()

with app.app_context():
    db.create_all()
    seed_themes()
    seed_templates()
    seed_tasks()
    pass
    

if __name__ == "__main__":  # для того чтобы проект запускался как приложение flask
    app.run(host="0.0.0.0", port=5000)  # debug чтобы выводились на страничке все ошибки

