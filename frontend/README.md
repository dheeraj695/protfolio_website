# Dheeraj Mishra Portfolio + HireMeAI Frontend

A responsive macOS-inspired desktop portfolio with clickable folders, a resume link, search, and an AI chat panel wired to the FastAPI `/chat` endpoint.

## Run the backend
From the project root (`hiremeai/`), activate your existing environment and run:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Make sure `GROQ_API_KEY` is set in the root `.env` file and that `my_resume.pdf` is present in the project root. Never publish your `.env` file.

## Run the frontend
Open `frontend/index.html` directly, or serve the project with a static server (recommended):

```bash
python -m http.server 5500 --directory frontend
```

Then open `http://127.0.0.1:5500`. The chat defaults to `http://127.0.0.1:8000`. For a deployed backend, set `window.HIREMEAI_API_URL` before `script.js` loads to your API base URL and configure CORS to allow only your deployed frontend origin.

## Before publishing
- Replace or confirm experience details and public profile links.
- Add a real public email address if you want email contact.
- Configure CORS with your production frontend domain instead of `*`.
- Do not upload `.env`, API keys, or `.venv` to your deployment.
