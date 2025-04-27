from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from config import Config
from models import db, Users

# Создаем приложение
app = Flask(__name__)  
app.config.from_object(Config)  # Загружаем конфигурацию

# Инициализируем SQLAlchemy и LoginManager
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
        new_user = Users(name=name, email=email, password=hash)
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


# Роуты графический калькулятор
@app.route('/calculate')
def calculate():
    return render_template('calculate.html', current_path=request.path)

# Создаем таблицы в базе данных
with app.app_context():
    db.create_all()

if __name__ == "__main__":  # для того чтобы проект запускался как приложение flask
    app.run(debug=True)  # debug чтобы выводились на страничке все ошибки
