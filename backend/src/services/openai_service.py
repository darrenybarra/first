import openai
from ..config.settings import Config

class OpenAIService:
    @staticmethod
    def get_chat_response(message):
        openai.api_key = Config.OPENAI_API_KEY
        
        response = openai.ChatCompletion.create(
            model=Config.OPENAI_MODEL,
            messages=[
                {"role": "user", "content": message}
            ]
        )
        
        return response.choices[0].message.content 