
"use strict";

/* =====================================================
   DHEERAJ MISHRA PORTFOLIO
   FastAPI endpoints: /health and /chat
   ===================================================== */

const $ = (selector) => document.querySelector(selector);

const contentWindow = $("#contentWindow");
const windowTitle = $("#windowTitle");
const windowContent = $("#windowContent");
const searchPop = $("#searchPop");
const searchInput = $("#searchInput");
const searchResults = $("#searchResults");
const chatPanel = $("#chatPanel");
const chatMessages = $("#chatMessages");
const chatForm = $("#chatForm");
const chatInput = $("#chatInput");
const sendMessage = $("#sendMessage");
const apiStatus = $("#apiStatus");
const quickQuestions = $("#quickQuestions");

let composeMode = false;
let waitingForReply = false;
let conversationHistory = [];

/* =====================================================
   PORTFOLIO CONTENT
   ===================================================== */

const sections = {
  projects: {
    title: "My Projects",
    html: `
      <h2>Projects</h2>
      <p>Some of my full-stack, AI and DevOps work.</p>

      <article class="content-card">
        <h3>Indu AI Assistant</h3>
        <p>
          An AI assistant built around Python, FastAPI, LLM integrations,
          prompt engineering and OCR-based document processing.
        </p>
        <div class="tag-list">
          <span class="tag">Python</span>
          <span class="tag">FastAPI</span>
          <span class="tag">LLMs</span>
          <span class="tag">OCR</span>
        </div>
      </article>

      <article class="content-card">
        <h3>Smart Car Wash Agentic Management System</h3>
        <p>
          An agentic AI project designed to automate scheduling,
          task assignment and operational workflows.
        </p>
        <div class="tag-list">
          <span class="tag">Agentic AI</span>
          <span class="tag">Python</span>
          <span class="tag">Automation</span>
        </div>
      </article>

      <article class="content-card">
        <h3>CI/CD & Container Deployment Pipeline</h3>
        <p>
          Containerized application deployment using Docker,
          Kubernetes, Jenkins, Linux and cloud infrastructure.
        </p>
        <div class="tag-list">
          <span class="tag">Docker</span>
          <span class="tag">Kubernetes</span>
          <span class="tag">Jenkins</span>
          <span class="tag">AWS</span>
        </div>
      </article>

      <article class="content-card">
        <h3>Linux Server Setup & Troubleshooting</h3>
        <p>
          Linux server administration, Nginx, SSH, Bash automation,
          monitoring and service troubleshooting.
        </p>
        <div class="tag-list">
          <span class="tag">Linux</span>
          <span class="tag">Bash</span>
          <span class="tag">Nginx</span>
          <span class="tag">GCP</span>
        </div>
      </article>
    `
  },

  about: {
    title: "About Me",
    html: `
      <h2>Hi, I'm Dheeraj Mishra 👋</h2>
      <p>
        I'm a Python Full Stack AI Engineer focused on building
        useful web applications, REST APIs and AI-powered systems.
      </p>

      <article class="content-card">
        <h3>What I do</h3>
        <p>
          I work across backend development, frontend interfaces,
          LLM applications, automation, databases and deployment.
        </p>
      </article>

      <article class="content-card">
        <h3>Education</h3>
        <p>MCA — Kanpur Institute of Technology (AKTU), 2021–2023.</p>
        <p>B.Sc. Computer Science — Kanpur University, 2018–2021.</p>
      </article>

      <p>
        <a href="./resume.pdf" target="_blank" rel="noopener">
          Open my resume ↗
        </a>
      </p>
    `
  },

  skills: {
    title: "Technical Skills",
    html: `
      <h2>Technical Skills</h2>

      <article class="content-card">
        <h3>Languages</h3>
        <div class="tag-list">
          <span class="tag">Python</span>
          <span class="tag">SQL</span>
          <span class="tag">JavaScript</span>
          <span class="tag">Bash</span>
        </div>
      </article>

      <article class="content-card">
        <h3>Backend & APIs</h3>
        <div class="tag-list">
          <span class="tag">FastAPI</span>
          <span class="tag">Django</span>
          <span class="tag">Django REST Framework</span>
          <span class="tag">Node.js</span>
          <span class="tag">REST APIs</span>
        </div>
      </article>

      <article class="content-card">
        <h3>AI & Machine Learning</h3>
        <div class="tag-list">
          <span class="tag">LLMs</span>
          <span class="tag">RAG</span>
          <span class="tag">Prompt Engineering</span>
          <span class="tag">LangChain</span>
          <span class="tag">OCR</span>
          <span class="tag">Agentic AI</span>
          <span class="tag">MCP</span>
        </div>
      </article>

      <article class="content-card">
        <h3>Frontend</h3>
        <div class="tag-list">
          <span class="tag">HTML5</span>
          <span class="tag">CSS3</span>
          <span class="tag">React</span>
          <span class="tag">Redux</span>
        </div>
      </article>

      <article class="content-card">
        <h3>Databases, Cloud & DevOps</h3>
        <div class="tag-list">
          <span class="tag">PostgreSQL</span>
          <span class="tag">MySQL</span>
          <span class="tag">MongoDB</span>
          <span class="tag">Redis</span>
          <span class="tag">Docker</span>
          <span class="tag">Kubernetes</span>
          <span class="tag">Jenkins</span>
          <span class="tag">AWS</span>
          <span class="tag">GCP</span>
          <span class="tag">Linux</span>
        </div>
      </article>
    `
  },

  experience: {
    title: "Experience",
    html: `
      <h2>Professional Experience</h2>

      <article class="content-card">
        <h3>Python Full Stack Developer (AI & DevOps)</h3>
        <p><strong>Sudhanshu & Siddharth Innovations Pvt. Ltd.</strong></p>
        <p>Jan 2026 – Present</p>
        <p>
          Developing backend APIs, LLM-powered features, OCR pipelines,
          agentic AI workflows, containerized applications and CI/CD.
        </p>
      </article>

      <article class="content-card">
        <h3>Associate Full Stack Developer</h3>
        <p><strong>Rise OTB</strong> · Oct 2024 – Dec 2025</p>
        <p>
          Worked on risk-management applications, transaction monitoring,
          data pipelines, SQL optimization and reporting.
        </p>
      </article>

      <article class="content-card">
        <h3>Software Developer Trainee</h3>
        <p><strong>Spiral InfoSoft</strong> · Aug 2023 – Mar 2024</p>
        <p>
          Developed full-stack applications, CRUD APIs, database schemas
          and third-party service integrations.
        </p>
      </article>
    `
  },

  contact: {
    title: "Contact Me",
    html: `
      <h2>Let's Connect</h2>
      <p>Interested in working together? Get in touch.</p>

      <article class="content-card">
        <h3>Email</h3>
        <p>
          <a href="mailto:dheerajmishra33464@gmail.com">
            dheerajmishra33464@gmail.com
          </a>
        </p>
      </article>

      <article class="content-card">
        <h3>Professional profiles</h3>
        <p>
          <a href="https://github.com/dheeraj695"
             target="_blank" rel="noopener">GitHub ↗</a>
        </p>
        <p>
          <a href="https://linkedin.com/in/dheeraj-mishra-762560228"
             target="_blank" rel="noopener">LinkedIn ↗</a>
        </p>
      </article>

      <button class="explore" data-open-chat type="button">
        Ask Dheeraj Assistant ✦
      </button>
    `
  }
};

/* =====================================================
   PORTFOLIO WINDOWS
   ===================================================== */

function openWindow(sectionName) {
  const section = sections[sectionName];

  if (!section || !contentWindow || !windowTitle || !windowContent) {
    return;
  }

  windowTitle.textContent = section.title;
  windowContent.innerHTML = section.html;

  contentWindow.classList.remove("hidden");
  contentWindow.classList.remove("maximized");

  searchPop?.classList.add("hidden");
}

function closeWindow() {
  contentWindow?.classList.add("hidden");
  contentWindow?.classList.remove("maximized");
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) return;

  const trigger = target.closest("[data-window]");

  if (trigger) {
    event.preventDefault();
    openWindow(trigger.dataset.window);
  }

  const chatTrigger = target.closest("[data-open-chat]");

  if (chatTrigger) {
    openChat();
  }
});

$("#closeWindow")?.addEventListener("click", closeWindow);

$("#minimizeWindow")?.addEventListener("click", () => {
  contentWindow?.classList.add("hidden");
});

$("#maximizeWindow")?.addEventListener("click", () => {
  contentWindow?.classList.toggle("maximized");
});

/* =====================================================
   LIVE CLOCK
   ===================================================== */

function updateClock() {
  const clock = $("#clock");
  if (!clock) return;

  clock.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 30000);

/* =====================================================
   THEME TOGGLE
   ===================================================== */

$("#themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

/* =====================================================
   SEARCH
   ===================================================== */

$("#searchToggle")?.addEventListener("click", () => {
  searchPop?.classList.toggle("hidden");

  if (!searchPop?.classList.contains("hidden")) {
    searchInput?.focus();
  }
});

function renderSearchResults(query) {
  if (!searchResults) return;

  searchResults.replaceChildren();

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return;

  const matches = Object.entries(sections).filter(([key, section]) => {
    const text = `${key} ${section.title} ${section.html}`
      .replace(/<[^>]*>/g, " ")
      .toLowerCase();

    return text.includes(normalizedQuery);
  });

  if (matches.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No matching section found.";
    searchResults.append(empty);
    return;
  }

  matches.forEach(([key, section]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `📁 ${section.title}`;

    button.addEventListener("click", () => {
      openWindow(key);
    });

    searchResults.append(button);
  });
}

searchInput?.addEventListener("input", () => {
  renderSearchResults(searchInput.value);
});

$("#infoToggle")?.addEventListener("click", () => {
  openWindow("about");
});

/* =====================================================
   CHAT WINDOW
   ===================================================== */

function openChat() {
  chatPanel?.classList.remove("hidden");
  chatInput?.focus();
}

function closeChat() {
  chatPanel?.classList.add("hidden");
}

$("#askMe")?.addEventListener("click", openChat);
$("#closeChat")?.addEventListener("click", closeChat);

function addMessage(text, type = "bot") {
  if (!chatMessages) return null;

  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;

  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}

/* =====================================================
   ASK MODE / COMPOSE EMAIL MODE
   ===================================================== */

function setComposeMode(enabled) {
  composeMode = enabled;

  $("#askMode")?.classList.toggle("active", !enabled);
  $("#composeMode")?.classList.toggle("active", enabled);

  if (chatInput) {
    chatInput.placeholder = enabled
      ? "Describe the email you want to write…"
      : "Ask a question…";

    chatInput.value = "";
    chatInput.focus();
  }

  quickQuestions?.classList.toggle("hidden", enabled);

  addMessage(
    enabled
      ? "Email composition mode is on. Tell me the recipient, purpose, and important details."
      : "You're back in Ask Me mode. What would you like to know?",
    "bot"
  );
}

$("#askMode")?.addEventListener("click", () => setComposeMode(false));
$("#composeMode")?.addEventListener("click", () => setComposeMode(true));

quickQuestions?.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) return;

  const button = target.closest("button");
  if (!button) return;

  if (button.id === "composeEmail") {
    setComposeMode(true);
    return;
  }

  if (chatInput && chatForm) {
    chatInput.value = button.textContent.trim();
    chatForm.requestSubmit();
  }
});

/* Support a separate Compose Email button, if present */
$("#composeEmail")?.addEventListener("click", () => {
  if (!composeMode) {
    setComposeMode(true);
  }
});

/* =====================================================
   BACKEND HEALTH CHECK
   ===================================================== */

async function checkBackend() {
  if (!apiStatus) return;

  try {
    const response = await fetch("/health", {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Health check returned HTTP ${response.status}`);
    }

    const data = await response.json();

    apiStatus.textContent =
      data.status === "ok"
        ? "Dheeraj Assistant · Backend connected."
        : "Backend responded, but its health status is unknown.";
  } catch (error) {
    console.error("Backend health check failed:", error);

    apiStatus.textContent =
      "Assistant backend could not be reached. Check that FastAPI is running.";
  }
}

checkBackend();

/* =====================================================
   RESPONSE EXTRACTION
   ===================================================== */

function extractReply(data) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const candidates = [
      data.answer,
      data.response,
      data.reply,
      data.message,
      data.output,
      data.result,
      data.content
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }

    if (Array.isArray(data.choices)) {
      const choice = data.choices[0];
      const content = choice?.message?.content ?? choice?.text;

      if (typeof content === "string" && content.trim()) {
        return content;
      }
    }
  }

  return "The server responded, but no text reply was found.";
}

/* =====================================================
   SEND MESSAGE TO FASTAPI
   IMPORTANT:
   Backend expects "question", NOT "message".
   ===================================================== */

async function askBackend(userText) {
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      question: userText,
      mode: composeMode ? "compose_email" : "resume"
    })
  });

  const raw = await response.text();

  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { detail: raw };
  }

  if (!response.ok) {
    let errorMessage = `Chat request failed with HTTP ${response.status}.`;

    if (data && typeof data === "object") {
      if (Array.isArray(data.detail)) {
        errorMessage = data.detail
          .map((item) => {
            const location = Array.isArray(item.loc)
              ? item.loc.join(".")
              : "request";

            return `${location}: ${item.msg || "Invalid value"}`;
          })
          .join("; ");
      } else if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (typeof data.error === "string") {
        errorMessage = data.error;
      }
    }

    throw new Error(errorMessage);
  }

  const reply = extractReply(data);

  if (!reply || reply.startsWith("The server responded,")) {
    throw new Error(reply || "The server returned an empty response.");
  }

  return reply;
}

/* =====================================================
   CHAT SUBMISSION
   ===================================================== */

chatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = chatInput?.value.trim();

  if (!text || waitingForReply) return;

  const submittedMode = composeMode ? "compose_email" : "resume";

  addMessage(text, "user");

  conversationHistory.push({
    role: "user",
    content: text,
    mode: submittedMode
  });

  if (chatInput) {
    chatInput.value = "";
  }

  waitingForReply = true;

  if (sendMessage) {
    sendMessage.disabled = true;
  }

  const pending = addMessage("Thinking…", "bot");

  try {
    // Pass the original user request to the backend.
    // The backend already has separate prompts for each mode.
    const reply = await askBackend(text);

    if (pending) {
      pending.textContent = reply;
    }

    conversationHistory.push({
      role: "assistant",
      content: reply,
      mode: submittedMode
    });

    if (apiStatus) {
      apiStatus.textContent =
        submittedMode === "compose_email"
          ? "Draft generated · Review it before sending."
          : "Dheeraj Assistant · Response received.";
    }
  } catch (error) {
    console.error("Chat request failed:", error);

    if (pending) {
      pending.className = "message error";
      pending.textContent =
        `Unable to get a reply: ${error.message}`;
    }

    if (apiStatus) {
      apiStatus.textContent = "Assistant request failed.";
    }
  } finally {
    waitingForReply = false;

    if (sendMessage) {
      sendMessage.disabled = false;
    }

    chatInput?.focus();

    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
});

/* =====================================================
   ENTER TO SEND / SHIFT+ENTER FOR NEW LINE
   ===================================================== */

chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm?.requestSubmit();
  }
});

/* =====================================================
   ESCAPE CLOSES PANELS
   ===================================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWindow();
    searchPop?.classList.add("hidden");
    closeChat();
  }
});
