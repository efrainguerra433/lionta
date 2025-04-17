from flask import Blueprint, request, jsonify
from app.models import Metrica
from app import db

metrica_bp = Blueprint("metrica", __name__)

@metrica_bp.route("/registrar_metrica", methods=["POST"])
def registrar_metrica():
    data = request.json

    # Verificar si el jugador existe
    jugador = jugador.query.get(data["jugador_id"])
    if not jugador:
        return jsonify({"error": "Jugador no registrado"}), 404  # Si el jugador no existe, retorna un error 404

    try:
        metrica = Metrica(
            jugador_id=data["jugador_id"],
            posicion=data.get("posicion"),
            edad=data.get("edad"),
            altura=data.get("altura"),
            peso=data.get("peso"),
            velocidad=data.get("velocidad"),
            aceleracion=data.get("aceleracion")
        )
        db.session.add(metrica)
        db.session.commit()
        return jsonify({"mensaje": "Métrica registrada correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@metrica_bp.route("/jugador/<int:jugador_id>/metricas", methods=["GET"])
def obtener_metricas(jugador_id):
    metricas = Metrica.query.filter_by(jugador_id=jugador_id).all()
    resultado = [{
        "id": m.id,
        "posicion": m.posicion,
        "edad": m.edad,
        "altura": m.altura,
        "peso": m.peso,
        "velocidad": m.velocidad,
        "aceleracion": m.aceleracion
    } for m in metricas]
    return jsonify(resultado)

@metrica_bp.route("/jugador/<int:jugador_id>/metrica", methods=["PUT"])
def actualizar_metrica(jugador_id):
    data = request.json
    metrica = Metrica.query.filter_by(jugador_id=jugador_id).first()

    if not metrica:
        return jsonify({"error": "Métrica no encontrada para este jugador"}), 404

    metrica.posicion = data.get("posicion", metrica.posicion)
    metrica.edad = data.get("edad", metrica.edad)
    metrica.altura = data.get("altura", metrica.altura)
    metrica.peso = data.get("peso", metrica.peso)
    metrica.velocidad = data.get("velocidad", metrica.velocidad)
    metrica.aceleracion = data.get("aceleracion", metrica.aceleracion)

    try:
        db.session.commit()
        return jsonify({"mensaje": "Métrica actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
