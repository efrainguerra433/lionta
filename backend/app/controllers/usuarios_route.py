from flask import Blueprint, request, jsonify
from app.models import Usuario
from datetime import date
from itsdangerous import URLSafeTimedSerializer
from flask import current_app
import smtplib
from email.mime.text import MIMEText
from app import db

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    usuario = Usuario.query.filter_by(email=data["email"]).first()
    if usuario and usuario.check_password(data["contraseña"]):
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "rol": usuario.rol
            }
        }), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401

@usuario_bp.route("/registrar_usuario", methods=["POST"])
def registrar_usuario():
    data = request.json

    # Validar campos obligatorios
    required_fields = ("nombre", "email", "contraseña", "rol", "documento", "categoria", "fecha_vencimiento_pago")
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    # Verificar email único
    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El correo ya está registrado"}), 400

    # Verificar documento único
    if Usuario.query.filter_by(documento=data["documento"]).first():
        return jsonify({"error": "El documento ya está registrado"}), 400

    # Crear usuario
    nuevo_usuario = Usuario(
        nombre=data["nombre"],
        email=data["email"],
        rol=data["rol"]
    )
    nuevo_usuario.set_password(data["contraseña"])
    db.session.add(nuevo_usuario)
    db.session.commit()

    # Crear jugador solo si el rol es "jugador"
    if data["rol"] == "jugador":
        nuevo_usuario.documento = data["documento"]
        nuevo_usuario.categoria = data["categoria"]
        nuevo_usuario.estado = True
        nuevo_usuario.fecha_vencimiento_pago = date.fromisoformat(data["fecha_vencimiento_pago"])
        db.session.commit()
    token = generar_token_verificacion(nuevo_usuario.email)
    enviar_correo_verificacion(nuevo_usuario.email, token)
    return jsonify({"mensaje": "Usuario y jugador creados correctamente"}), 201

@usuario_bp.route("/jugadores", methods=["GET"])
def obtener_jugadores():
    jugadores = Usuario.query.filter_by(rol="jugador").all()
    resultado = [{
        "id": j.id,
        "nombre": j.nombre,
        "documento": j.documento,
        "categoria": j.categoria,
        "estado": j.estado,
        "fecha_vencimiento_pago": j.fecha_vencimiento_pago.strftime("%Y-%m-%d") if j.fecha_vencimiento_pago else None
    } for j in jugadores]
    return jsonify(resultado)

@usuario_bp.route("/jugador/<int:usuario_id>", methods=["GET"])
def obtener_jugador(usuario_id):
    jugador = Usuario.query.get(usuario_id)
    if not jugador or jugador.rol != "jugador":
        return jsonify({"error": "Jugador no encontrado"}), 404
    return jsonify({
        "id": jugador.id,
        "nombre": jugador.nombre,
        "documento": jugador.documento,
        "categoria": jugador.categoria,
        "estado": jugador.estado,
        "fecha_vencimiento_pago": jugador.fecha_vencimiento_pago.strftime("%Y-%m-%d") if jugador.fecha_vencimiento_pago else None
    }), 200

@usuario_bp.route("/verificar/<token>", methods=["GET"])
def verificar_cuenta(token):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='verificacion-correo', max_age=28800)
        usuario = Usuario.query.filter_by(email=email).first()
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404
        usuario.verificado = True
        db.session.commit()
        return jsonify({"mensaje": "Cuenta verificada correctamente"}), 200
    except Exception:
        return jsonify({"error": "Token inválido o expirado"}), 400


def generar_token_verificacion(email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return s.dumps(email, salt='verificacion-correo')

def enviar_correo_verificacion(destinatario, token):
    link = f"http://localhost:3000/verificar/{token}"
    cuerpo = f"Haz clic en este enlace para verificar tu cuenta:\n\n{link}"

    mensaje = MIMEText(cuerpo)
    mensaje["Subject"] = "Verificación de cuenta"
    mensaje["From"] = "efrain.guerra201008@gmail.com"
    mensaje["To"] = destinatario

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login("efrain.guerra201008@gmail.com", "hvoo fbgn vtbt jbal")
            servidor.send_message(mensaje)
        print("Correo enviado correctamente")
    except Exception as e:
        print("Error al enviar el correo:", e)


@usuario_bp.route("/usuarios", methods=["GET", "OPTIONS"])
def obtener_usuarios():
    if request.method == "OPTIONS":
        return '', 204

    usuarios = Usuario.query.all()
    resultado = [{
        "id": u.id,
        "nombre": u.nombre,
        "email": u.email,
        "rol": u.rol,
        "documento": u.documento,
        "categoria": u.categoria,
        "estado": u.estado,
        "fecha_vencimiento_pago": u.fecha_vencimiento_pago.strftime("%Y-%m-%d") if u.fecha_vencimiento_pago else None
    } for u in usuarios]
    return jsonify(resultado)
