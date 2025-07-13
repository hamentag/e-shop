# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from chat_logic import generate_and_handle_response

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data["user_input"]
    chat_history = data["chat_history"]
    conversation_state = data["conversation_state"]

    updated_state = generate_and_handle_response(chat_history, user_input, conversation_state)

    assistant_msg = next(
        (msg["content"] for msg in reversed(chat_history) if msg["role"] == "assistant"),
        "I'm here to help."
    )

    return jsonify({
        "reply": assistant_msg,
        "updated_state": updated_state
    })

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)