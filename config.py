import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:melman@localhost/EdicationPlatformDB'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'K5s2G9jP4FvA7rL3tQ1W6eD8'
