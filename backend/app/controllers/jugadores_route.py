from flask import Blueprint, request, jsonify, render_template
from app.models import Jugador
from app.models import Estadistica
from app.models import Metrica
from app import db
from datetime import datetime

jugador_bp = Blueprint("jugador", __name__)

@jugador_bp.route("/formulario_registro")
def formulario_registro():
    return render_template("prueba_registro.html")

@jugador_bp.route("/registrar_jugador", methods=["POST"])
def registrar_jugador():
    data = request.json  # Recibe los datos en formato JSON

    try:
        # Crear jugador
        jugador = Jugador(
            nombre=data["nombre"],
            documento=data["documento"],
            categoria=data["categoria"],
            estado=data.get("estado", True),
            fecha_vencimiento_pago=datetime.strptime(data["fecha_vencimiento_pago"], "%Y-%m-%d").date()
        )
        db.session.add(jugador)
        db.session.commit()

        # Crear entradas vacías en las tablas de Métricas y Estadísticas
        metrica = Metrica(jugador_id=jugador.id)  # Aquí puedes dejar las métricas vacías al principio
        estadistica = Estadistica(jugador_id=jugador.id)  # Igualmente para las estadísticas

        db.session.add(metrica)
        db.session.add(estadistica)
        db.session.commit()

        return jsonify({"mensaje": "Jugador registrado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@jugador_bp.route("/jugadores", methods=["GET"])
def obtener_jugadores():
    jugadores = Jugador.query.all()
    resultado = [{
        "id": j.id,
        "nombre": j.nombre,
        "documento": j.documento,
        "categoria": j.categoria,
        "estado": j.estado,
        "fecha_vencimiento_pago": j.fecha_vencimiento_pago.strftime("%Y-%m-%d")
    } for j in jugadores]
    return jsonify(resultado)

@jugador_bp.route("/jugador/<int:jugador_id>", methods=["GET"])
def obtener_jugador(jugador_id):
    jugador = Jugador.query.get(jugador_id)

    if not jugador:
        return jsonify({"error": "Jugador no encontrado"}), 404

    return jsonify({
        "id": jugador.id,
        "nombre": jugador.nombre,
        "documento": jugador.documento,
        "categoria": jugador.categoria,
        "estado": jugador.estado,
        "fecha_vencimiento_pago": jugador.fecha_vencimiento_pago.strftime("%Y-%m-%d")
    }), 200

@jugador_bp.route("/jugador/<int:jugador_id>", methods=["PUT"])
def actualizar_jugador(jugador_id):
    data = request.json
    jugador = Jugador.query.get(jugador_id)

    if not jugador:
        return jsonify({"error": "Jugador no encontrado"}), 404

    # Actualiza solo si se envía el dato
    jugador.nombre = data.get("nombre", jugador.nombre)
    jugador.documento = data.get("documento", jugador.documento)
    jugador.categoria = data.get("categoria", jugador.categoria)
    jugador.estado = data.get("estado", jugador.estado)

    if "fecha_vencimiento_pago" in data:
        from datetime import datetime
        jugador.fecha_vencimiento_pago = datetime.strptime(data["fecha_vencimiento_pago"], "%Y-%m-%d").date()

    try:
        db.session.commit()
        return jsonify({"mensaje": "Jugador actualizado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
