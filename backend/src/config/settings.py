import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    OPENAI_MODEL = "gpt-4o-mini"
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development') 