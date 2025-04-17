from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Importa los modelos antes de crear las tablas
    with app.app_context():
        from app import models
        db.create_all()

    # Importa y registra los blueprints
    from app.controllers.jugadores_route import jugador_bp
    from app.controllers.metricas_route import metrica_bp
    from app.controllers.estadisticas_route import estadistica_bp
    from app.controllers.usuarios_route import usuario_bp

    app.register_blueprint(jugador_bp)
    app.register_blueprint(metrica_bp)
    app.register_blueprint(estadistica_bp)
    app.register_blueprint(usuario_bp)

    return app







