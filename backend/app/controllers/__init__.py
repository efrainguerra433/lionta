from .usuarios_route import usuario_bp
from .estadisticas_route import estadistica_bp
from .metricas_route import metrica_bp

# Lista de blueprints para registrar en la aplicación
blueprints = [
    usuario_bp,
    estadistica_bp,
    metrica_bp
]