import os

DB_USER = "johne"  # Cambia esto si usas otro usuario
DB_PASSWORD = "orange"
DB_HOST = "localhost"  # Si es necesario, cambia por el nombre correcto de tu host
DB_NAME = "lionta_db"

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
