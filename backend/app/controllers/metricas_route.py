from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.metrica import Metrica 
from app.models.usuario import Usuario
from app import db
from sqlalchemy.sql import func

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

@metrica_bp.route("/metricas", methods=["GET"])
def obtener_metricas_todos_los_usuarios():
    metricas = Metrica.query.all()
    resultado = [
        {
            "usuario_id": metrica.usuario_id,
            "usuario_nombre": Usuario.query.get(metrica.usuario_id).nombre,
            "id": metrica.id,
            "posicion": metrica.posicion,
            "edad": metrica.edad,
            "altura": metrica.altura,
            "peso": metrica.peso,
            "velocidad": metrica.velocidad,
            "aceleracion": metrica.aceleracion,
        }
        for metrica in metricas
    ]
    return jsonify(resultado), 200

# Endpoint para que los jugadores visualicen sus métricas
@metrica_bp.route("/metricas/jugador", methods=["GET"])
@jwt_required()
def obtener_metricas_jugador():
    # Obtener el ID del usuario autenticado desde el token JWT
    usuario_id = get_jwt_identity()

    # Filtrar las métricas por el usuario autenticado
    metricas = Metrica.query.filter_by(usuario_id=usuario_id).all()
    if not metricas:
        return jsonify({"error": "No hay métricas registradas para este jugador"}), 404

    # Formatear las métricas para la respuesta
    resultado = [{
        "id": m.id,
        "posicion": m.posicion,
        "edad": m.edad,
        "altura": m.altura,
        "peso": m.peso,
        "velocidad": m.velocidad,
        "aceleracion": m.aceleracion
    } for m in metricas]

    return jsonify(resultado), 200

@metrica_bp.route("/ultima-metrica", methods=["GET"])
def obtener_ultima_metrica():
    # Obtener la última métrica ordenada por ID
    ultima_metrica = Metrica.query.order_by(Metrica.id.desc()).first()
    if not ultima_metrica:
        return jsonify({"error": "No hay métricas registradas"}), 404

    resultado = {
        "id": ultima_metrica.id,
        "usuario_id": ultima_metrica.usuario_id,
        "usuario_nombre": Usuario.query.get(ultima_metrica.usuario_id).nombre,
        "posicion": ultima_metrica.posicion,
        "edad": ultima_metrica.edad,
        "altura": ultima_metrica.altura,
        "peso": ultima_metrica.peso,
        "velocidad": ultima_metrica.velocidad,
        "aceleracion": ultima_metrica.aceleracion
    }
    return jsonify(resultado), 200

@metrica_bp.route("/metricas/recientes", methods=["GET"])
def obtener_metricas_recientes():
    # Obtener las métricas más recientes de cada usuario
    subquery = (
        Metrica.query
        .with_entities(Metrica.usuario_id, func.max(Metrica.id).label("max_id"))
        .group_by(Metrica.usuario_id)
        .subquery()
    )

    metricas_recientes = (
        Metrica.query
        .join(subquery, Metrica.id == subquery.c.max_id)
        .all()
    )

    resultado = [
        {
            "usuario_id": metrica.usuario_id,
            "usuario_nombre": Usuario.query.get(metrica.usuario_id).nombre,
            "id": metrica.id,
            "posicion": metrica.posicion,
            "edad": metrica.edad,
            "altura": metrica.altura,
            "peso": metrica.peso,
            "velocidad": metrica.velocidad,
            "aceleracion": metrica.aceleracion,
        }
        for metrica in metricas_recientes
    ]

    return jsonify(resultado), 200
