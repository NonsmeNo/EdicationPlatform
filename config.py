import os

# локальная база данных
# class Config:
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
#         'postgresql://postgres:melman@localhost/EdicationPlatformDB'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     SECRET_KEY = 'K5s2G9jP4FvA7rL3tQ1W6eD8'


# база данных в яндекс облаке
class Config:
    SQLALCHEMY_DATABASE_URI = (
        "postgresql://superuser:Zerg6161@rc1a-o7dtdmmh5abl2bik.mdb.yandexcloud.net:6432/edicationDB"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'K5s2G9jP4FvA7rL3tQ1W6eD8'