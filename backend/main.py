import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from groq import Groq
from pydantic import BaseModel, Field
from pypdf import PdfReader

# Project layout:
# hiremeai/
#   .env
#   my_resume.pdf
#   backend/main.py
#   frontend/index.html, script.js, style.css

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
RESUME_PATH = BASE_DIR / "my_resume.pdf"

load_dotenv(BASE_DIR / ".env")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
app = FastAPI(title="HireMeAI API")


def get_groq_client() -> Groq:
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is missing. Add it to the project .env file.",
        )
    return Groq(api_key=GROQ_API_KEY)


class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills_used: list[str] = Field(default_factory=list)


class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    total_experience_years: float | None = None
    skills: list[str] = Field(default_factory=list)
    experiences: list[Experience] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=8000)
    mode: Literal["resume", "compose_email"] = "resume"


def read_pdf(file_path: Path) -> str:
    if not file_path.is_file():
        raise FileNotFoundError(
            f"Resume PDF not found at {file_path}. Put my_resume.pdf in the project root."
        )

    reader = PdfReader(str(file_path))
    pages = [(page.extract_text() or "").strip() for page in reader.pages]
    text = "\n".join(page for page in pages if page)
    if not text.strip():
        raise ValueError("No readable text was extracted from my_resume.pdf.")
    return text


def parse_resume(resume_text: str) -> Resume:
    client = get_groq_client()
    schema = Resume.model_json_schema()
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert resume parser. Extract facts from the resume "
                "semantically, including internships under experiences. Extract skills "
                "from the whole resume. Never invent details. Use null for missing "
                "scalar values and [] for missing lists. Return only JSON matching "
                f"this schema:\n{json.dumps(schema)}"
            ),
        },
        {"role": "user", "content": f"Parse this resume:\n\n{resume_text}"},
    ]
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={"type": "json_object"},
        temperature=0,
    )
    raw = response.choices[0].message.content
    if not raw:
        raise ValueError("The resume parser returned an empty response.")
    return Resume.model_validate_json(raw)


@lru_cache(maxsize=1)
def get_resume() -> Resume:
    # Cache the parsed resume so every chat message doesn't re-parse the PDF.
    return parse_resume(read_pdf(RESUME_PATH))


def ask_candidate(question: str, resume: Resume, mode: str) -> str:
    if mode == "compose_email":
        task = (
            "Help draft or improve a professional email using only facts from the "
            "candidate's resume. Do not invent achievements, employers, dates, or skills. "
            "If key details are missing, use clear placeholders or say what information "
            "is needed."
        )
    else:
        task = (
            "Answer questions about the candidate as a professional interview/resume "
            "assistant. Use only the resume information. If a fact is unavailable, say: "
            "\"I don't have enough information to answer that.\""
        )

    response = get_groq_client().chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    f"{task}\n\nCandidate resume data:\n"
                    f"{resume.model_dump_json(indent=2)}"
                ),
            },
            {"role": "user", "content": question},
        ],
        temperature=0.3,
    )
    answer = response.choices[0].message.content
    if not answer:
        raise ValueError("The AI returned an empty answer.")
    return answer


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api")
def api_home():
    return {"message": "HireMeAI API is running. Use POST /chat to ask a question."}


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        resume = get_resume()
        answer = ask_candidate(request.question, resume, request.mode)
        return {"answer": answer}
    except HTTPException:
        raise
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        # Log full exception in the server terminal, but keep API errors readable.
        print(f"Chat endpoint error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=500,
            detail="The assistant could not answer right now. Check the backend terminal and .env configuration.",
        ) from exc


# Serve the portfolio frontend from the same FastAPI server.
# Keep this mount last so /health and /chat remain API routes.
if FRONTEND_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
