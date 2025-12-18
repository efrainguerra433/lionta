from app import db
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer

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
    #Verificacion
    verificado = db.Column(db.Boolean, default=False)
    token_verificacion = db.Column(db.String(255), nullable=True)
    # Relaciones
    estadisticas = db.relationship("Estadistica", backref="usuario", 
                                 cascade="all, delete-orphan")
    metricas = db.relationship("Metrica", backref="usuario", 
                             cascade="all, delete-orphan")

    def set_password(self, password):
        self.contraseña_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.contraseña_hash, password)