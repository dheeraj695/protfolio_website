# HireMeAI — Portfolio + Resume Chatbot

The portfolio frontend and FastAPI backend are wired together. For the simplest setup, run FastAPI and open the frontend at the same origin; this avoids local CORS issues.

## 1. Configure your API key

From the `hiremeai/` project root, copy `.env.example` to `.env` and set your own `GROQ_API_KEY`. Never commit or upload `.env`.

## 2. Install dependencies

Python 3.11+ is required. In the project root:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -e .
```

## 3. Start the combined app

From the project root:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open **http://127.0.0.1:8000**. The same server serves the website, resume, CSS/JS, and `/chat` API. Check **http://127.0.0.1:8000/health** for the backend health endpoint.

## Optional: separate frontend server

You can also run `python -m http.server 5500 --directory frontend` and open `http://127.0.0.1:5500`. The chatbot will use `http://127.0.0.1:8000`. For a separately hosted production frontend, define `window.HIREMEAI_API_URL` before `script.js` loads and set `CORS_ORIGINS` in the backend environment to the exact frontend origin(s).

## Important notes

- `my_resume.pdf` must remain in the project root; it is the PDF parsed by the AI assistant.
- The first chatbot request parses the resume and calls Groq; valid API credentials and internet access are required.
- The frontend's portfolio details and links should be reviewed for accuracy before publishing.
- `.env`, `.venv`, and real API keys must not be deployed in the ZIP or public repository.
