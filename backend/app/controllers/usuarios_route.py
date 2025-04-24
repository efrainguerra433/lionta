from flask import Blueprint, request, jsonify
from app.models import Usuario
from app import db

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/registrar_usuario", methods=["POST"])
def registrar_usuario():
    data = request.json
    if not all(k in data for k in ("nombre", "email", "contraseña", "rol")):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El correo ya está registrado"}), 400
    nuevo_usuario = Usuario(
        nombre=data["nombre"],
        email=data["email"],
        rol=data["rol"]
    )
    nuevo_usuario.set_password(data["contraseña"])
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"mensaje": "Usuario creado correctamente"}), 201

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

@usuario_bp.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    usuarios = Usuario.query.all()
    resultado = [{
        "id": u.id,
        "nombre": u.nombre,
        "email": u.email,
        "rol": u.rol
    } for u in usuarios]
    return jsonify(resultado)
