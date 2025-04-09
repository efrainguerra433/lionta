from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from flask_cors import CORS
from flask_migrate import Migrate 
db = SQLAlchemy()
migrate = Migrate()
def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    from app.routes import main
    app.register_blueprint(main)

    # Esto asegura que se creen las tablas dentro del contexto de la app
    with app.app_context():
        from app import models
        db.create_all()

    return app






