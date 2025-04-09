from app import db
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contraseña_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), default="jugador")  # "jugador" o "admin"

    def set_password(self, password):
        self.contraseña_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.contraseña_hash, password)


class Jugador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    documento = db.Column(db.String(20), unique=True, nullable=False)
    categoria = db.Column(db.Integer, nullable=False)  # Año de nacimiento
    estado = db.Column(db.Boolean, default=True)  # True = activo
    fecha_vencimiento_pago = db.Column(db.Date, nullable=True)

    # Relaciones
    metricas = db.relationship('Metrica', backref='jugador', lazy=True)
    estadisticas = db.relationship('Estadistica', backref='jugador', lazy=True)


class Metrica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jugador_id = db.Column(db.Integer, db.ForeignKey('jugador.id'), nullable=False)
    posicion = db.Column(db.String(50), nullable=True)
    edad = db.Column(db.Integer, nullable=True)
    altura = db.Column(db.Float, nullable=True)  # en metros
    peso = db.Column(db.Float, nullable=True)    # en kg
    velocidad = db.Column(db.Float, nullable=True)  # en m/s
    aceleracion = db.Column(db.Float, nullable=True)  # en m/s^2


class Estadistica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jugador_id = db.Column(db.Integer, db.ForeignKey('jugador.id'), nullable=False)
    goles = db.Column(db.Integer, default=0)
    asistencias = db.Column(db.Integer, default=0)
    atajadas = db.Column(db.Integer, default=0)  # solo si es portero
    partidos_jugados = db.Column(db.Integer, default=0)

