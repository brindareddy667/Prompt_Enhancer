import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


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

Output ONLY in this format.

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

    response = model.generate_content(prompt)

    return response.text