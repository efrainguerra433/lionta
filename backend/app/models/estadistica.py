from app import db

class Estadistica(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    goles = db.Column(db.Integer, default=0)
    asistencias = db.Column(db.Integer, default=0)
    atajadas = db.Column(db.Integer, default=0)
    partidos_jugados = db.Column(db.Integer, default=0)