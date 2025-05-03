from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    img = db.Column(db.String(255), nullable=True)

class Themes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)


class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_text = db.Column(db.String(500), nullable=False)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id'), nullable=False)

    theme = db.relationship('Themes', backref=db.backref('tasks', lazy=True))

class Templates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    template = db.Column(db.String(255), nullable=False)
    template_show = db.Column(db.String(255), nullable=False)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id'), nullable=False)

    theme = db.relationship('Themes', backref=db.backref('templates', lazy=True))


class SavedTasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(500), nullable=False)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('templates.id'), nullable=False)

    theme = db.relationship('Themes', backref=db.backref('saved_tasks', lazy=True))
    user = db.relationship('Users', backref=db.backref('saved_tasks', lazy=True))
    template = db.relationship('Templates', backref=db.backref('saved_tasks', lazy=True))