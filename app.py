from flask import (
    Flask,
    render_template,
    request,
    jsonify
)

from utils.prompt_generator import generate_prompts

app = Flask(__name__)

history = []


@app.route("/")
def home():

    return render_template(
        "index.html",
        history=history
    )


@app.route(
    "/enhance",
    methods=["POST"]
)
def enhance():

    try:

        data = request.get_json()

        user_prompt = data.get(
            "prompt",
            ""
        ).strip()

        style = data.get(
            "style",
            "Photorealistic"
        )

        if not user_prompt:

            return jsonify(
                {
                    "success": False,
                    "message": "Please enter a prompt."
                }
            )

        result = generate_prompts(
            user_prompt,
            style
        )

        history.insert(
    0,
    {
        "prompt": user_prompt,
        "style": style
    }
         )

        history[:] = history[:10]

        if len(history) > 10:
            history.pop()

        return jsonify(
            {
                "success": True,
                "response": result
            }
        )

    except Exception as e:

        return jsonify(
            {
                "success": False,
                "message": str(e)
            }
        )


@app.route("/history")
def get_history():

    return jsonify(history)


if __name__ == "__main__":

    app.run(
        debug=True
    )