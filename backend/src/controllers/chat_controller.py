from flask import jsonify, request
from ..services.openai_service import OpenAIService

def handle_chat():
    try:
        data = request.json
        message = data.get('message')
        
        response = OpenAIService.get_chat_response(message)
        
        return jsonify({
            'response': response
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 