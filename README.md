# CodeBlind

> A real-time multiplayer coding game where each player receives one secret function to implement in pseudocode, and then the entire team must deduce what larger system they just built together, with an AI judge scoring every move.

---

## Architecture

```text
Player A ──┐                           ┌── MongoDB
Player B ──┤──► Socket.IO ──► Node.js ─┤── Groq AI (GPT-OSS-20B)
Player C ──┤    (WebSocket)   Express  └── In-Memory Room State
Player D ──┘
```

---

## The Problem & Solution

Standard coding platforms (LeetCode, HackerRank) are **solo and synchronous**: they test recall, not systems thinking. They give you the full picture.

**CodeBlind flips this model.** Each player sees *only their function*, and no one knows the overall system. Each player writes pseudocode in isolation, the team reviews all submissions together, and then collectively guesses what system they assembled. An LLM grades logic (not syntax), and another LLM verifies whether the team's guess is semantically correct.

This trains **architectural reasoning, function design, and collaborative debugging**, the core skills that matter on real engineering teams.

---

## What I Built

- **Secret-piece game engine**: Server assigns each player one unique function from a MongoDB puzzle. Players never see each other's function names or goals during the coding phase.
- **Monaco Editor integration**: Full VS Code editor experience in the browser, pre-populated with the player's function signature, supporting smooth pseudocode authoring.
- **AI pseudocode grader**: On `Validate`, the LLM evaluates logic intent, not syntax. Ignores variable naming, brackets, and formatting. Returns a score (0-100), pass/fail, and one-sentence feedback.
- **AI semantic verifier**: On final guess submission, a second LLM call checks if the team's guess semantically matches the hidden goal (e.g. "food app" correctly matches "Food Delivery App").
- **Real-time state machine**: 6 distinct game phases (`lobby → code → waiting → discuss → guess → results`) synchronized across all players via Socket.IO rooms.
- **Automatic host promotion**: When a host leaves, the next player in the room is silently promoted to host without any disruption.
- **Scalable puzzle schema**: MongoDB stores problems keyed by `length` (2/3/4 players), auto-matching the right puzzle to the room size at game start.

---

## Metrics & Impact

### System Architecture
| Dimension | Detail |
|---|---|
| **Supported room sizes** | 2, 3, or 4 players |
| **Seeded puzzles** | 3 domains (ATM Withdrawal, Online Shopping Cart, Student Exam Results) |
| **AI calls per game session** | 1 per validation attempt + 1 final verify |
| **Socket events** | 10 distinct typed events (join, leave, start, validate, submit, sync, chat, discuss, end) |

### AI Grading Engine
| Property | Value |
|---|---|
| **Model** | `openai/gpt-oss-20b` via Groq API |
| **Response format** | Structured JSON (`score`, `feedback`, `passed`) with zero parsing fragility |
| **Grading policy** | Logic-only evaluation; syntax, naming, and style are explicitly excluded |
| **Fallback** | Hard error boundary returns `{ score: 0, passed: false }` on timeout/failure |
| **Verify tolerance** | Semantic match (short-form and colloquial guesses are scored as correct) |

### Frontend Performance
| Metric | Detail |
|---|---|
| **Bundle toolchain** | Vite 8 (cold start dev server in ~300ms) |
| **State management** | Zero Redux/Zustand overhead using a single `GameManager` component with `useRef` socket |
| **Real-time transport** | WebSocket-only (no polling fallback), configured via `transports: ['websocket']` |
| **Editor load** | Monaco Editor lazy-loaded; fallback "Initializing..." screen prevents layout shift |

### Backend Efficiency
| Metric | Detail |
|---|---|
| **Room state** | Pure in-memory JS object with zero DB reads during active gameplay |
| **DB queries per game** | 1 (puzzle fetch at `start_game`), all subsequent operations are in-memory |
| **Deployment** | Render.com (server) + Render.com (client) with live production URLs |

---

## Tech Stack

**Frontend**
- React 19, React Router v7, Vite 8
- Monaco Editor (`@monaco-editor/react`): VS Code-grade editing in browser
- Socket.IO Client v4, Tailwind CSS v4
- Prism.js + React Syntax Highlighter: code display in discussion phase

**Backend**
- Node.js + Express 5, Socket.IO v4
- Mongoose + MongoDB: puzzle storage and schema enforcement
- Groq SDK: LLM API client (`openai/gpt-oss-20b` model)
- dotenv, CORS, nodemon

**AI / Intelligence Layer**
- Groq API: ultra-low-latency inference
- Structured JSON response format: deterministic parsing
- Two-stage AI pipeline: pseudocode grader → team guess verifier

---

## Game Flow

```text
1. HOST creates a room (2P / 3P / 4P) → gets a random 4-letter room code
2. PLAYERS join with the room code and a display name
3. HOST starts the game → server fetches a matching puzzle from MongoDB
4. Each player receives ONE secret function (name, goal, sample inputs) privately
5. Players write pseudocode in Monaco Editor, can hit VALIDATE for AI feedback
6. On SUBMIT, server waits until all players finish → triggers Discussion phase
7. All code is revealed side-by-side with syntax highlighting
8. Team chats in real-time and submits ONE collective guess about the system
9. Groq AI verifies the guess → Win (green) or Lose (red) screen with AI feedback
```

---

> **Note:** The client connects to `[https://codeblind-z8ay.onrender.com](https://codeblind-z8ay.onrender.com)` by default. To point at your local server, update the `URL` constant in `src/GameManager.jsx`.

---

## Project Structure

```text
codeblind/
├── src/
│   ├── GameManager.jsx          # Central state machine: owns all socket logic
│   ├── pages/
│   │   ├── Home.jsx             # Create/Join room UI
│   │   ├── Lobby.jsx            # Player waiting room with host controls
│   │   ├── Code.jsx             # Monaco editor + AI validation panel
│   │   ├── Waiting.jsx          # Holding screen while others submit
│   │   ├── Guess.jsx            # Code review, team chat, final guess
│   │   ├── Win.jsx              # Success screen with AI feedback
│   │   └── Lose.jsx             # Failure screen with AI feedback
│   └── components/
│       └── NavBar.jsx
└── server/
    ├── server.js                # Express + Socket.IO bootstrap
    └── main/
        ├── config/
        │   ├── db.js            # MongoDB connection
        │   └── seed.js          # Puzzle seeding script
        ├── models/
        │   └── problem.js       # Mongoose schema (Problem + Piece)
        ├── services/
        │   └── llm.js           # Groq AI: gradePlayerCode() + verify()
        └── sockets/
            ├── socketManager.js # Connects all handlers to io
            ├── roomHandler.js   # join_room, leave_room
            ├── gameHandler.js   # start_game, validate, submit, chat, guess
            └── state.js         # Shared in-memory activeRooms store
```

---

## Live Demo

- **Frontend:** [https://codeblind.onrender.com](https://codeblind.onrender.com) *(may take ~30s to wake from Render cold start)*
- **Backend:** [https://codeblind-z8ay.onrender.com](https://codeblind-z8ay.onrender.com)