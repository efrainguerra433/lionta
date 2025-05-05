from flask import Blueprint, request, jsonify
from app.models import Estadistica, Usuario
from app import db

estadistica_bp = Blueprint("estadistica", __name__)

@estadistica_bp.route("/usuario/<int:usuario_id>/estadisticas", methods=["POST"])
def registrar_estadistica(usuario_id):
    # Verificar si el usuario existe y es jugador
    usuario = Usuario.query.get(usuario_id)
    if not usuario or usuario.rol != "jugador":
        return jsonify({"error": "Usuario no válido o no es un jugador"}), 404

    data = request.json

    # Crear una nueva estadística
    nueva_estadistica = Estadistica(
        usuario_id=usuario_id,
        goles=data.get("goles", 0),
        asistencias=data.get("asistencias", 0),
        partidos_jugados=data.get("partidos_jugados", 0),
        atajadas=data.get("atajadas", 0)
    )
    db.session.add(nueva_estadistica)

    try:
        db.session.commit()
        return jsonify({"mensaje": "Estadística registrada correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@estadistica_bp.route("/usuario/<int:usuario_id>/estadisticas", methods=["GET"])
def obtener_estadisticas(usuario_id):
    estadisticas = Estadistica.query.filter_by(usuario_id=usuario_id).all()
    resultado = [{
        "id": e.id,
        "goles": e.goles,
        "asistencias": e.asistencias,
        "partidos_jugados": e.partidos_jugados,
        "atajadas": e.atajadas
    } for e in estadisticas]
    return jsonify(resultado), 200

@estadistica_bp.route("/usuario/<int:usuario_id>/estadisticas", methods=["PUT"])
def actualizar_estadistica(usuario_id):
    data = request.json
    estadistica = Estadistica.query.filter_by(usuario_id=usuario_id).first()

    if not estadistica:
        return jsonify({"error": "Estadística no encontrada para este jugador"}), 404

    estadistica.goles = data.get("goles", estadistica.goles)
    estadistica.asistencias = data.get("asistencias", estadistica.asistencias)
    estadistica.atajadas = data.get("atajadas", estadistica.atajadas)
    estadistica.partidos_jugados = data.get("partidos_jugados", estadistica.partidos_jugados)

    try:
        db.session.commit()
        return jsonify({"mensaje": "Estadística actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


