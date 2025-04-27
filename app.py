from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from config import Config  # Импортируем конфигурацию
from models import db, Users
# Создаем приложение
app = Flask(__name__)  
app.config.from_object(Config)  # Загружаем конфигурацию

# Инициализируем SQLAlchemy и LoginManager
db = SQLAlchemy(app)
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

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/calculate')
def calculate():
    return render_template('calculate.html', current_path=request.path)

# Создаем таблицы в базе данных
with app.app_context():
    db.create_all()

if __name__ == "__main__":  # для того чтобы проект запускался как приложение flask
    app.run(debug=True)  # debug чтобы выводились на страничке все ошибки
