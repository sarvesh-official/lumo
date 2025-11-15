# 🧠 Lumo

**Your AI-powered science tutor that helps students chat, learn, and revise smarter.**

Lumo is a modern web application built with **Next.js** and **TypeScript**.
It uses the **ChatGPT API** to provide real-time tutoring assistance for science subjects, allowing students to interact with an AI, generate flashcards, and revise key concepts efficiently.

---

## 🚀 Features

* 💬 **AI Chat Interface** — Chat with an AI tutor and receive real-time responses powered by the ChatGPT API.
* ⚡ **Flashcard Generator** — Instantly create flashcards from your chat or topic prompts for easy revision.
* 🧩 **Flashcard Viewer** — Flip through flashcards in a clean, distraction-free interface.
* 🔐 **Google Authentication** — Secure sign-in with Google powered by Clerk.

---

## 🧪 Tech Stack

* **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
* **Backend:** Next.js API Routes
* **AI:** OpenAI (ChatGPT API)
* **Auth:** Clerk (Google OAuth)
* **Deployment:** Vercel

---

## 🧱 Architecture Overview

```
Frontend (Next.js + TypeScript)
   ↕
API Routes
   ├── /api/chat → Handles ChatGPT streaming responses
   └── /api/generateFlashcards → Generates flashcards from AI output
Auth (Clerk - Google OAuth)
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/lumo.git
cd lumo
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a `.env.local` file

```
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_frontend_key
CLERK_SECRET_KEY=your_clerk_backend_key
```

### 4️⃣ Run the development server

```bash
npm run dev
```

The app will be live at [http://localhost:3000](http://localhost:3000)

---

## 📄 License

This project is licensed under the **MIT License**.

---

> *Lumo — making science learning smarter, faster, and mor
