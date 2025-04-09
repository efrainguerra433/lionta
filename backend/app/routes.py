from flask import Blueprint
from flask import request, jsonify
from app.models import Jugador
from app.models import Metrica
from app.models import Estadistica
from app import db
from datetime import datetime
from app.models import Jugador

main = Blueprint("main", __name__)  

@main.route("/registrar_jugador", methods=["POST"])
def registrar_jugador():
    data = request.json  # Recibe los datos en formato JSON

    try:
        jugador = Jugador(
            nombre=data["nombre"],
            documento=data["documento"],
            categoria=data["categoria"],
            estado=data.get("estado", True),
            fecha_vencimiento_pago=datetime.strptime(data["fecha_vencimiento_pago"], "%Y-%m-%d").date()
        )
        db.session.add(jugador)
        db.session.commit()
        return jsonify({"mensaje": "Jugador registrado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@main.route("/jugadores", methods=["GET"])
def obtener_jugadores():
    jugadores = Jugador.query.all()
    resultado = []

    for j in jugadores:
        resultado.append({
            "id": j.id,
            "nombre": j.nombre,
            "documento": j.documento,
            "categoria": j.categoria,
            "estado": j.estado,
            "fecha_vencimiento_pago": j.fecha_vencimiento_pago.strftime("%Y-%m-%d")
        })

    return jsonify(resultado)

@main.route("/registrar_metrica", methods=["POST"])
def registrar_metrica():
    data = request.json

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

@main.route("/jugador/<int:jugador_id>/metricas", methods=["GET"])
def obtener_metricas(jugador_id):
    metricas = Metrica.query.filter_by(jugador_id=jugador_id).all()

    resultado = []
    for m in metricas:
        resultado.append({
            "id": m.id,
            "posicion": m.posicion,
            "edad": m.edad,
            "altura": m.altura,
            "peso": m.peso,
            "velocidad": m.velocidad,
            "aceleracion": m.aceleracion
        })

    return jsonify(resultado)

@main.route("/registrar_estadistica", methods=["POST"])
def registrar_estadistica():
    data = request.json

    try:
        estadistica = Estadistica(
            jugador_id=data["jugador_id"],
            goles=data.get("goles", 0),
            asistencias=data.get("asistencias", 0),
            atajadas=data.get("atajadas", 0),
            partidos_jugados=data.get("partidos_jugados", 0)
        )
        db.session.add(estadistica)
        db.session.commit()
        return jsonify({"mensaje": "Estadística registrada correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@main.route("/jugador/<int:jugador_id>/estadisticas", methods=["GET"])
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


