# Proyecto de Diseño Integrador con Gerencia de Proyectos

Este proyecto forma parte del curso de Diseño Integrador, el cual combina conocimientos técnicos y de gestión para desarrollar una solución integral a un problema específico. El enfoque principal es aplicar principios de **gerencia de proyectos** para planificar, ejecutar y controlar cada etapa del desarrollo.

## Objetivos del Proyecto
- Integrar conocimientos adquiridos en diferentes áreas de ingeniería.
- Aplicar metodologías de gerencia de proyectos para garantizar el cumplimiento de objetivos.
- Desarrollar una solución innovadora y funcional que responda a una necesidad real.

## Componentes Clave
1. **Definición del Alcance**: Identificar claramente los objetivos y entregables del proyecto.
2. **Planificación**: Elaborar un cronograma, asignar recursos y definir roles.
3. **Ejecución**: Implementar la solución técnica siguiendo las mejores prácticas.
4. **Control y Seguimiento**: Monitorear el progreso y realizar ajustes según sea necesario.
5. **Cierre**: Documentar resultados y presentar el producto final.

Este proyecto no solo busca desarrollar habilidades técnicas, sino también fortalecer competencias en liderazgo, trabajo en equipo y toma de decisiones.

import serial
import time
import json
import paho.mqtt.client as mqtt

# Configura el puerto UART (ajusta el nombre según tu caso, ejemplo: '/dev/ttyUSB0' o '/dev/serial0')
UART_PORT = '/dev/serial0'
BAUD_RATE = 9600

# MQTT
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "sensores/aire"

# Inicializar UART
ser = serial.Serial(UART_PORT, BAUD_RATE, timeout=1)
time.sleep(2)  # Espera para estabilizar la conexión UART

# Inicializar cliente MQTT
client = mqtt.Client()
client.connect(MQTT_BROKER, MQTT_PORT, 60)

print("Enviando datos desde UART a MQTT...")

while True:
    try:
        if ser.in_waiting > 0:
            line = ser.readline().decode("utf-8").strip()
            if line:
                try:
                    # Si el ESP32 ya envía en formato JSON
                    data = json.loads(line)
                    client.publish(MQTT_TOPIC, json.dumps(data))
                    print(f"Publicado: {data}")
                except json.JSONDecodeError:
                    print(f"Formato no válido: {line}")
    except KeyboardInterrupt:
        print("\nFinalizando...")
        break
    except Exception as e:
        print(f"Error: {e}")

ser.close()
