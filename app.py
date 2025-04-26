import os
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

 # делаем app основным файлом для работы с Flask
app = Flask(__name__)  
app.secret_key = 'K5s2G9jP4FvA7rL3tQ1W6eD8'

# Настройки конфигурации
basedir = os.path.abspath(os.path.dirname(__file__))
class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config.from_object(Config)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)



@app.route('/')  # отслеживаем главную страничку
def index():
    return render_template('index.html', current_path=request.path)


if __name__ == "__main__":  # для того чтобы проект запускался как приложение flask
    app.run(debug=True)  # debug чтобы выводились на страничке все ошибки