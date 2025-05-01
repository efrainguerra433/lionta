from app import db
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contraseña_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), default="jugador")  # "jugador" o "admin"

    # Campos que antes estaban en Jugador
    documento = db.Column(db.String(20), unique=True, nullable=True)
    categoria = db.Column(db.Integer, nullable=True)
    estado = db.Column(db.Boolean, default=True)
    fecha_vencimiento_pago = db.Column(db.Date, nullable=True)

    # Relaciones
    metricas = db.relationship('Metrica', backref='usuario_metrica', lazy=True)
    estadisticas = db.relationship('Estadistica', backref='usuario_estadistica', lazy=True)

    def set_password(self, password):
        self.contraseña_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.contraseña_hash, password)


class Metrica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    posicion = db.Column(db.String(50), nullable=True)
    edad = db.Column(db.Integer, nullable=True)
    altura = db.Column(db.Float, nullable=True)
    peso = db.Column(db.Float, nullable=True)
    velocidad = db.Column(db.Float, nullable=True)
    aceleracion = db.Column(db.Float, nullable=True)


class Estadistica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    goles = db.Column(db.Integer, default=0)
    asistencias = db.Column(db.Integer, default=0)
    atajadas = db.Column(db.Integer, default=0)
    partidos_jugados = db.Column(db.Integer, default=0)

