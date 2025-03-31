from flask import Blueprint

main = Blueprint("main", __name__)  # Crea un "blueprint" para organizar las rutas

@main.route("/")  # Ruta principal
def home():
    return "¡El backend está funcionando!"  # Mensaje que se muestra en el navegador
