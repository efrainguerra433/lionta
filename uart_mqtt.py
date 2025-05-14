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
