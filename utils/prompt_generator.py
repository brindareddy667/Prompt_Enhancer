import requests


OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_prompts(user_prompt, style):

    prompt = f"""
You are a professional AI image prompt engineer.

User Prompt:
{user_prompt}

Style:
{style}

Generate exactly 3 prompt versions.

For each version include:

PROMPT:
<enhanced prompt>

REASON:
<why this prompt is effective>

Requirements:
- detailed visual description
- lighting
- atmosphere
- camera angle
- composition
- textures
- mood
- style consistency

Make each version different.

Output ONLY in the format below.

VERSION 1

PROMPT:
...

REASON:
...

VERSION 2

PROMPT:
...

REASON:
...

VERSION 3

PROMPT:
...

REASON:
...

Do not write introductions.

Do not write conclusions.

Do not write explanations outside the format.
"""

    payload = {
        "model": "gemma3:1b",
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=120
    )

    data = response.json()

    return data["response"]