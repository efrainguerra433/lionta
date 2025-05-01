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

    # Importa los modelos DESPUÉS de inicializar db
    from app.models import Usuario

    # Crea el admin si no existe
    with app.app_context():
        db.create_all()
        if not Usuario.query.filter_by(email="admin@lionta.com").first():
            admin = Usuario(
                nombre="Administrador General",
                email="admin@lionta.com",
                rol="admin"
            )
            admin.set_password("admin123")
            db.session.add(admin)
            db.session.commit()

    # Importa y registra los blueprints
    
    from app.controllers.metricas_route import metrica_bp
    from app.controllers.estadisticas_route import estadistica_bp
    from app.controllers.usuarios_route import usuario_bp

    
    app.register_blueprint(metrica_bp)
    app.register_blueprint(estadistica_bp)
    app.register_blueprint(usuario_bp)

    return app







