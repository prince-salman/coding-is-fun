<div align="center">

# 🚀 Coding is Fun — TechNova

**An interactive, gamified platform for learning HTML inside a simulated VS Code workspace.**

Learn front-end fundamentals by playing the role of a freshly-hired Junior Developer — guided by a voice-driven mentor, validated in real time, and rewarded with XP and career ranks.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

</div>

---

## 📖 Overview

**Coding is Fun** turns learning HTML into a story-driven game. Instead of reading static tutorials, the learner is "recruited" into the fictional company **TechNova** and works through a curriculum delivered by an in-app mentor. The UI is a faithful recreation of the Visual Studio Code interface — activity bar, explorer, editor tabs, terminal panel, live browser preview, and status bar — so learners build muscle memory in an environment that mirrors the real tools they will use professionally.

Each lesson validates the learner's code live as they type, plays synthesized typing/success sound effects, and (optionally) narrates instructions aloud using the browser's Speech Synthesis API in Indonesian.

> The learning content is written in **Bahasa Indonesia**; the codebase and documentation follow English conventions.

---

## ✨ Features

- 🖥️ **VS Code–styled UI** — menu bar, activity bar, explorer, tabs, terminal, status bar, and a split live preview.
- 📚 **Three learning tracks** — story-driven **HTML**, **CSS**, and **JavaScript** chapters, each ending with a certification exam.
- ✅ **Real-time validation** — each module ships a typed `validator` function that checks the learner's code on every keystroke.
- 🎮 **Gamification** — earn XP per module/exam and climb from *Trainee Intern* → *Junior Developer* → *Mid-Level* → *Senior* → *Tech Lead*.
- 💾 **Progress persistence** — name, position, and XP are saved to `localStorage`, so a refresh resumes where you left off.
- 🔒 **Sandboxed preview** — learner code runs inside an isolated `<iframe sandbox>` (scripts enabled only for the JS track, never `same-origin`).
- 🔊 **Synthesized audio** — typing and success sound effects generated with the Web Audio API (no audio assets required).
- 🗣️ **Voice mentor** — optional text-to-speech narration via the Web Speech API.
- ♿ **Accessible** — semantic landmarks, ARIA roles, `aria-live` mentor announcements, keyboard-focusable controls, and screen-reader labels.
- ⚡ **Personalization** — the learner's name is injected into lesson text (`{{playerName}}`).

---

## 🛠️ Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Language     | [TypeScript 5](https://www.typescriptlang.org) (strict mode) |
| Framework    | [React 19](https://react.dev)                |
| Build Tool   | [Vite 8](https://vitejs.dev)                 |
| Code Editor  | [react-simple-code-editor](https://github.com/react-simple-code-editor/react-simple-code-editor) + [PrismJS](https://prismjs.com) |
| Icons        | [lucide-react](https://lucide.dev)           |
| Testing      | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) (jsdom) |
| Audio        | Web Audio API (synthesized SFX)              |
| Narration    | Web Speech API (SpeechSynthesis)             |
| Linting      | [ESLint 10](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (or pnpm / yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prince-salman/codingisfun.git
cd codingisfun

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the URL printed in the terminal (typically `http://localhost:5173`).

### Gemini TTS Setup

The browser never receives your Gemini API key. The app calls the internal
`/api/tts` endpoint, and the Node/Vite server reads `GEMINI_API_KEY`.

```bash
# 1. Copy the example env file
copy .env.example .env

# 2. Fill GEMINI_API_KEY in .env
# Get a key from https://aistudio.google.com/apikey

# 3. Run the dev server
npm run dev
```

If `GEMINI_API_KEY` is empty, the TTS player stays visible but shows a safe
"feature disabled" state. For production, set the same environment variable in
your hosting dashboard and run:

```bash
npm run build
npm run start
```

### Available Scripts

| Command            | Description                                          |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR.                 |
| `npm run build`    | Type-check (`tsc -b`) and build into `dist/`.       |
| `npm run preview`  | Preview the production build locally.               |
| `npm run lint`     | Run ESLint across the project.                      |
| `npm run test`     | Run the test suite in watch mode (Vitest).          |
| `npm run test:run` | Run the test suite once (CI mode).                  |

---

## 📂 Project Structure

```
codingisfun/
├── public/                  # Static assets (favicons, icons)
├── src/
│   ├── assets/              # Images used by the app
│   ├── components/          # UI components (Onboarding, VSCodeLayout, Sidebar,
│   │                        #   EditorPane, MentorPanel, PreviewPane)
│   ├── hooks/               # useAudio, useSpeech, useGameProgress
│   ├── data/               # Curriculum data per track + combined index
│   │   ├── html.ts         #   HTML track
│   │   ├── css.ts          #   CSS track
│   │   ├── javascript.ts   #   JavaScript track
│   │   └── index.ts        #   Combined CURRICULUM export
│   ├── utils/preview.ts    # Builds the sandboxed iframe srcDoc per language
│   ├── test/setup.ts       # Vitest setup (jsdom stubs for Audio/Speech)
│   ├── types.ts            # Shared types: Module, Chapter, validator, etc.
│   ├── App.tsx             # Thin orchestrator wiring hooks + components
│   ├── App.css             # VS Code theme & layout styles
│   ├── index.css           # Global base styles
│   └── main.tsx            # React entry point
├── index.html              # HTML shell
├── tsconfig*.json          # TypeScript project configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
└── eslint.config.js        # ESLint configuration
```

---

## 🧩 Adding a Lesson

The entire learning experience is data-driven by the files in `src/data/`. To add a module, append a typed `Module` entry to the relevant chapter's `modules` array (e.g. in `html.ts`, `css.ts`, or `javascript.ts`):

```ts
{
  id: "1.4",
  type: "materi",                  // "materi" (lesson) or "ujian" (exam, worth 3× XP)
  language: "markup",              // "markup" | "css" | "javascript" — drives highlighting & preview
  sender: { name: "Pak Budi", role: "Mentor Senior", avatar: "PB" },
  title: "Your Lesson Title",
  description: "Lesson text. Use {{playerName}} to address the learner.",
  initialCode: "<!-- starter code shown in the editor -->\n",
  validator: (code) => /<your-regex>/i.test(code),  // returns true when correct
  successMessage: "Shown when the learner passes. {{playerName}} works here too."
}
```

No component changes are required — the UI renders new modules automatically. Add a matching assertion in `src/data/curriculum.test.ts` to keep validators covered.

---

## 🗺️ Roadmap

- [x] Expand the curriculum beyond HTML into **CSS** and **JavaScript** tracks.
- [x] Persist learner progress and XP to `localStorage` (resume where you left off).
- [x] Sandbox the live preview in an `<iframe sandbox>` to harden against unsafe code.
- [x] Migrate the codebase to **TypeScript** for type-safe modules and validators.
- [x] Add **unit tests** for validators and **component tests** for the game flow.
- [x] Accessibility pass (keyboard navigation, ARIA roles, screen-reader labels).
- [ ] Internationalization (i18n) — make English content available alongside Bahasa Indonesia.
- [ ] Persist a per-module *completed* state and allow revisiting earlier lessons.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Commit your changes: `git commit -m "feat: add my feature"`.
4. Push the branch: `git push origin feat/my-feature`.
5. Open a Pull Request.

Please run `npm run lint` before submitting.

---

## 👥 Contributors

| Avatar | Name | GitHub |
| ------ | ---- | ------ |
| <img src="https://github.com/prince-salman.png" width="60" height="60" style="border-radius:50%" alt="prince-salman"/> | **Prince Salman** | [@prince-salman](https://github.com/prince-salman) |
| <img src="https://github.com/zaidanfaiz.png" width="60" height="60" style="border-radius:50%" alt="zaidanfaiz"/> | **Zaidan Faiz** | [@zaidanfaiz](https://github.com/zaidanfaiz) |

---

## 📜 License

This project is released under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by the TechNova team — *because coding is fun.*

</div>
