from flask import Blueprint, request, jsonify
from app.models import Metrica, Usuario
from app import db

metrica_bp = Blueprint("metrica", __name__)

@metrica_bp.route("/usuario/<int:usuario_id>/registrar_metrica", methods=["POST"])
def registrar_metrica(usuario_id):
    data = request.json

    # Verificar si el usuario existe y es jugador
    usuario = Usuario.query.get(usuario_id)
    if not usuario or usuario.rol != "jugador":
        return jsonify({"error": "Usuario no válido o no es un jugador"}), 404

    try:
        metrica = Metrica(
            usuario_id=usuario_id,
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

@metrica_bp.route("/usuario/<int:usuario_id>/metricas", methods=["GET"])
def obtener_metricas(usuario_id):
    metricas = Metrica.query.filter_by(usuario_id=usuario_id).all()
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

@metrica_bp.route("/usuario/<int:usuario_id>/metrica", methods=["PUT"])
def actualizar_metrica(usuario_id):
    data = request.json
    metrica = Metrica.query.filter_by(usuario_id=usuario_id).first()

    if not metrica:
        return jsonify({"error": "Métrica no encontrada para este usuario"}), 404

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
