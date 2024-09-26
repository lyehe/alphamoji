from flask import Flask
from src.config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    from app.routes import main

    app.register_blueprint(main)

    return app


from app import models
