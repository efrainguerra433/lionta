from app import create_app

app = create_app()  # Llamamos a la función que crea la app

if __name__ == "__main__":
    app.run(debug=True)  # Inicia Flask en modo debug
