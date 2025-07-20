import os

DB_USER = "johne" 
DB_PASSWORD = "orange"

DB_HOST = "localhost"  
DB_NAME = "lionta_db"

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "Orange"