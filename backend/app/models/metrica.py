from app import db


class Metrica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    posicion = db.Column(db.String(50), nullable=True)
    edad = db.Column(db.Integer, nullable=True)
    altura = db.Column(db.Float, nullable=True)
    peso = db.Column(db.Float, nullable=True)
    velocidad = db.Column(db.Float, nullable=True)
    aceleracion = db.Column(db.Float, nullable=True)