from flask import Blueprint, request, jsonify
from app.models import Usuario
from datetime import date, timedelta
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
    # Añadir verificación de cuenta (opcional pero recomendado)
    # if usuario and usuario.check_password(data["contraseña"]) and usuario.verificado:
    if usuario and usuario.check_password(data.get("contraseña")): # Usar .get para evitar KeyError
        # Considera añadir el token JWT aquí si lo estás usando para la sesión
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "rol": usuario.rol
            }
        }), 200
    else:
        # Mensaje más genérico para no revelar si el email existe o si la cuenta no está verificada
        return jsonify({"error": "Credenciales incorrectas"}), 401

@usuario_bp.route("/registrar_usuario", methods=["POST"])
def registrar_usuario():
    data = request.json

    # Validar campos obligatorios básicos
    required_fields_base = ("nombre", "email", "contraseña", "rol")
    if not all(k in data for k in required_fields_base):
        return jsonify({"error": "Faltan campos obligatorios (nombre, email, contraseña, rol)"}), 400

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
        rol=data["rol"],
        verificado=False # Inicia como no verificado
    )
    nuevo_usuario.set_password(data["contraseña"])

    # Asignar campos específicos de jugador si el rol es "jugador"
    if data["rol"] == "jugador":
        # Validar campos específicos de jugador
        required_fields_jugador = ("documento", "categoria", "fecha_vencimiento_pago")
        if not all(k in data for k in required_fields_jugador):
            return jsonify({"error": "Faltan campos obligatorios para el rol jugador (documento, categoria, fecha_vencimiento_pago)"}), 400
        nuevo_usuario.documento = data["documento"]
        nuevo_usuario.categoria = data["categoria"]
        nuevo_usuario.estado = True
        nuevo_usuario.fecha_vencimiento_pago = date.fromisoformat(data["fecha_vencimiento_pago"])

    db.session.add(nuevo_usuario)
    db.session.commit() # Guardar el usuario para obtener el ID si es necesario
    token = generar_token_verificacion(nuevo_usuario.email)
    enviar_correo("Verificación de cuenta", nuevo_usuario.email, f"Haz clic en este enlace para verificar tu cuenta y establecer tu contraseña:\n\nhttp://localhost:3000/verificar/{token}")
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

@usuario_bp.route("/verificar/<token>", methods=["POST"])
def verificar_cuenta(token):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='verificacion-correo', max_age=28800)
        usuario = Usuario.query.filter_by(email=email).first()
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        data = request.json
        nueva_contraseña = data.get("nueva_contraseña")
        if not nueva_contraseña:
            return jsonify({"error": "Falta la nueva contraseña"}), 400

        usuario.set_password(nueva_contraseña)
        usuario.verificado = True
        db.session.commit()
        return jsonify({"mensaje": "Cuenta verificada y contraseña actualizada"}), 200
    except Exception as e: # Captura específica de excepciones de itsdangerous es mejor
        return jsonify({"error": "Token inválido o expirado"}), 400



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

@usuario_bp.route("/usuario/<int:usuario_id>", methods=["DELETE"])
def eliminar_usuario(usuario_id):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"mensaje": "Usuario eliminado correctamente"}), 200

# Actualizar usuario
@usuario_bp.route("/usuario/<int:usuario_id>", methods=["PUT"])
def actualizar_usuario(usuario_id):
    data = request.json
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    usuario.nombre = data.get("nombre", usuario.nombre)
    usuario.email = data.get("email", usuario.email)
    usuario.rol = data.get("rol", usuario.rol)
    usuario.documento = data.get("documento", usuario.documento)
    usuario.categoria = data.get("categoria", usuario.categoria)
    usuario.estado = data.get("estado", usuario.estado)

    if data.get("fecha_vencimiento_pago"):
        from datetime import date
        usuario.fecha_vencimiento_pago = date.fromisoformat(data["fecha_vencimiento_pago"])

    db.session.commit()
    return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200


# --- Recuperación de Contraseña ---

@usuario_bp.route("/recuperar-contrasena", methods=["POST"])
def solicitar_recuperacion_contrasena():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email es requerido"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario:
        # Generar token específico para reseteo de contraseña
        token = generar_token_reseteo(usuario.email)
        reset_url = f"http://localhost:3000/restablecer-contrasena/{token}" 
        cuerpo = f"Hola {usuario.nombre},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n{reset_url}\n\nSi no solicitaste esto, ignora este mensaje. El enlace expirará en 1 hora."
        enviar_correo("Restablecer Contraseña", usuario.email, cuerpo)

    
    return jsonify({"mensaje": "Si tu email está registrado, recibirás instrucciones para restablecer tu contraseña."}), 200

@usuario_bp.route("/restablecer-contrasena", methods=["POST"])
def restablecer_contrasena():
    data = request.get_json()
    token = data.get('token')
    nueva_contrasena = data.get('nueva_contrasena')

    if not token or not nueva_contrasena:
        return jsonify({"error": "Token y nueva contraseña son requeridos"}), 400

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Actualizar contraseña
        usuario.set_password(nueva_contrasena)
        db.session.commit()

        return jsonify({"mensaje": "Contraseña actualizada correctamente."}), 200

    except Exception as e: # Capturar SignatureExpired, BadTimeSignature específicamente si se desea
        print(f"Error restableciendo contraseña: {e}") # Log del error
        return jsonify({"error": "Token inválido o expirado."}), 400


# --- Funciones Auxiliares ---

def generar_token_verificacion(email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return s.dumps(email, salt='verificacion-correo')

def generar_token_reseteo(email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    # Usar un 'salt' diferente para tokens de reseteo
    return s.dumps(email, salt='password-reset-salt')

def enviar_correo(asunto, destinatario, cuerpo):
    # Reemplaza con tus credenciales y configuración de servidor SMTP
    # Es MUY recomendable usar variables de entorno para esto
    remitente_email = "efrain.guerra201008@gmail.com"
    remitente_pass = "hvoo fbgn vtbt jbal" # ¡Considera usar contraseñas de aplicación si usas Gmail!
    smtp_server = "smtp.gmail.com"
    smtp_port = 465 # Para SSL

    mensaje = MIMEText(cuerpo)
    mensaje["Subject"] = asunto
    mensaje["From"] = remitente_email
    mensaje["To"] = destinatario

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as servidor:
            servidor.login(remitente_email, remitente_pass)
            servidor.send_message(mensaje)
        print(f"Correo '{asunto}' enviado correctamente a {destinatario}")
    except Exception as e:
        print(f"Error al enviar correo a {destinatario}: {e}")
        # Considera cómo manejar este error (e.g., loggear, reintentar)