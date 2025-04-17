from flask import Blueprint, request, jsonify
from app.models import Estadistica
from app.models import Jugador
from app import db

estadistica_bp = Blueprint("estadistica", __name__)

@estadistica_bp.route("/jugador/<int:jugador_id>/estadisticas", methods=["POST"])
def registrar_o_actualizar_estadistica(jugador_id):
    # Verificar si el jugador existe
    jugador = Jugador.query.get(jugador_id)
    if not jugador:
        return jsonify({"error": "Jugador no registrado"}), 404  # Si el jugador no existe, retorno un error

    data = request.json

    # Intentamos encontrar estadísticas existentes para el jugador
    estadistica = Estadistica.query.filter_by(jugador_id=jugador_id).first()

    if estadistica:
        estadistica.goles = data.get("goles", estadistica.goles)
        estadistica.asistencias = data.get("asistencias", estadistica.asistencias)
        estadistica.partidos_jugados = data.get("partidos_jugados", estadistica.partidos_jugados)
        estadistica.atajadas = data.get("atajadas", estadistica.atajadas)
        
        mensaje = "Estadísticas actualizadas correctamente"
    else:
        # Si no existe, creamos una nueva estadística
        estadistica = Estadistica(
            jugador_id=jugador_id,
            goles=data.get("goles", 0),
            asistencias=data.get("asistencias", 0),
            atajadas=data.get("atajadas", 0),
            partidos_jugados=data.get("partidos_jugados", 0)
        )
        db.session.add(estadistica)
        mensaje = "Estadística registrada correctamente"
        
    try:
        db.session.commit()
        return jsonify({"mensaje": mensaje}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@estadistica_bp.route("/jugador/<int:jugador_id>/estadisticas", methods=["GET"])
def obtener_estadisticas(jugador_id):
    estadisticas = Estadistica.query.filter_by(jugador_id=jugador_id).all()
    resultado = []
    for e in estadisticas:
        jugador = e.jugador
        posicion = jugador.metricas[0].posicion if jugador.metricas else None
        data = {
            "id": e.id,
            "goles": e.goles,
            "asistencias": e.asistencias,
            "partidos_jugados": e.partidos_jugados
        }
        if posicion == "Portero":
            data["atajadas"] = e.atajadas
        resultado.append(data)
    return jsonify(resultado)

@estadistica_bp.route("/jugador/<int:jugador_id>/estadisticas", methods=["PUT"])
def actualizar_estadistica(jugador_id):
    data = request.json
    estadistica = Estadistica.query.filter_by(jugador_id=jugador_id).first()

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

