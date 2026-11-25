# 🚀 Hackathon 2026 — Full-Stack Management Platform

A production-grade hackathon management system built with the MERN stack, upgraded with high-concurrency infrastructure: Redis caching, BullMQ job queues, sliding-window rate limiting, idempotency guards, MongoDB ACID transactions, and SSE-based real-time streaming.

**Live URLs:**
- 🌐 **Frontend:** [https://hackathon-website-one-omega.vercel.app](https://hackathon-website-one-omega.vercel.app)
- ⚡ **Backend API:** [https://hackathon-website-7e35.onrender.com](https://hackathon-website-7e35.onrender.com)
- 📂 **GitHub:** [https://github.com/Krishtiy/Hackathon_website](https://github.com/Krishtiy/Hackathon_website)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Backend Deep Dive](#-backend-deep-dive)
- [Frontend Deep Dive](#-frontend-deep-dive)
- [High-Concurrency Upgrades](#-high-concurrency-upgrades)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Local Setup](#-local-setup)

---

## 🎯 Problem Statement

Traditional hackathon platforms break under real-world load: simultaneous registrations cause duplicate teams, quiz submissions race each other, leaderboards go stale, and a single bad request can crash the server. This platform solves all of that:

| Problem | Solution Implemented |
|---|---|
| Duplicate quiz submissions | Idempotency middleware (Redis `SET NX`) |
| Team slot over-booking | MongoDB ACID transaction with `$expr` guard |
| Leaderboard DB overload | Redis ZSET with score + tie-breaking |
| Brute-force attacks | Sliding-window rate limiter (Redis ZSET) |
| Cold DB on every request | Cache-aside with TTL auto-invalidation |
| Long-running quiz grading | BullMQ async job queue |
| Real-time score updates | Server-Sent Events (SSE) streaming |

---

## 🏗 Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                    CLIENT (Vite + React 19)         │
│  React Router v7 · TanStack Query · Virtual Lists  │
│  Axios + Retry · Error Boundaries · Skeletons       │
└──────────────────────┬─────────────────────────────┘
                       │ HTTPS (REST + SSE)
┌──────────────────────▼─────────────────────────────┐
│              BACKEND (Express 5 + Node.js)          │
│                                                     │
│  Rate Limiter → Idempotency → Auth JWT              │
│       ↓                                             │
│  Controllers → Services → Models                    │
│       ↓            ↓                                │
│  BullMQ Queue   Cache Service                       │
│       ↓            ↓                                │
│  ┌─────────────────────────┐                        │
│  │   Upstash Redis (TLS)   │  ZSET leaderboard      │
│  │   BullMQ queues         │  Rate limit windows    │
│  │   Idempotency keys      │  Cache-aside TTL       │
│  └─────────────────────────┘                        │
│       ↓                                             │
│  ┌─────────────────────────┐                        │
│  │  MongoDB Atlas (M0)     │  Users, Teams          │
│  │  Replica Set (3 nodes)  │  Questions, Submissions│
│  │  ACID Transactions      │  Payments, State       │
│  └─────────────────────────┘                        │
└────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24.x | Runtime |
| Express | 5.1.0 | Web framework |
| Mongoose | 8.x | MongoDB ODM |
| MongoDB Atlas | M0 Free | Primary database |
| Upstash Redis | Serverless | Cache, queues, rate limiting |
| BullMQ | 6.x | Async job queue |
| ioredis | 5.x | Redis client |
| jsonwebtoken | 9.x | JWT auth |
| bcryptjs | 3.x | Password hashing |
| multer | 2.x | File uploads |
| nodemailer | 7.x | Email notifications |
| Razorpay | 2.x | Payment gateway |
| Jest + Supertest | 30.x | Testing |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.1 | UI framework |
| Vite | 7.x | Build tool |
| React Router | 7.x | Client-side routing |
| TanStack Query | 5.x | Server state & caching |
| TanStack Virtual | 3.x | Virtual list rendering |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 3.x | Styling |

---

## ⚙️ Backend Deep Dive

### Project Structure
```
server/
├── src/
│   ├── config/
│   │   └── redis.js           # Upstash Redis singleton (maxRetriesPerRequest: null)
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── teamController.js  # ACID team creation & member add
│   │   ├── quizController.js  # Quiz submit with idempotency
│   │   ├── paymentController.js
│   │   ├── submissionController.js
│   │   ├── round2Controller.js # File upload (Cloudinary/local fallback)
│   │   ├── stateController.js
│   │   ├── questionController.js
│   │   └── downloadController.js
│   ├── middlewares/
│   │   ├── rateLimiter.js     # Sliding-window ZSET rate limiter
│   │   ├── idempotency.js     # Atomic SET NX idempotency
│   │   ├── authMiddleware.js  # JWT verify + role guard
│   │   ├── errorHandler.js
│   │   ├── uploadMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── User.js            # bcrypt pre-save hook
│   │   ├── Team.js            # max 4 members
│   │   ├── Question.js
│   │   ├── Submission.js
│   │   ├── Payment.js
│   │   └── State.js           # Global round state singleton
│   ├── queues/
│   │   └── submissionQueue.js # BullMQ worker + SSE EventEmitter
│   ├── routes/
│   │   ├── authRoutes.js      # Rate-limited + idempotent register/login
│   │   ├── quizRoutes.js      # Idempotent submit + SSE stream + leaderboard
│   │   ├── teamRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── submissionRoutes.js
│   │   ├── round1Routes.js
│   │   ├── round2Routes.js
│   │   ├── stateRoutes.js
│   │   ├── questionRoutes.js
│   │   └── downloadRoutes.js
│   ├── services/
│   │   ├── cacheService.js       # Cache-aside: get/set/invalidate
│   │   ├── leaderboardService.js # Redis ZSET leaderboard
│   │   └── presignedUploadService.js # Cloudflare R2 (optional)
│   └── index.js               # App entry, MongoDB connect, conditional listen
├── tests/
│   ├── redis-leaderboard.test.js      # 3 tests ✅
│   ├── rate-limiter-idempotency.test.js # 2 tests ✅
│   └── mongo-atomic-concurrency.test.js # 1 test ✅
└── seedAdmin.js               # One-time admin seed script
```

### Key Design Decisions

**1. Express 5 (not 4)**
Express 5 natively supports `async/await` in route handlers — unhandled promise rejections propagate to the error handler automatically. No need for `try/catch` wrappers or `express-async-errors` package.

**2. Redis singleton with `maxRetriesPerRequest: null`**
BullMQ requires the ioredis connection used for blocking operations to have `maxRetriesPerRequest: null`. A single shared connection with this setting is reused across rate limiter, cache, leaderboard, and queue — avoiding connection pool exhaustion.

**3. MongoDB ACID Transaction for team join**
```js
// Atomically checks member count AND adds member in one transaction
const session = await mongoose.startSession();
session.startTransaction();
const team = await Team.findOneAndUpdate(
  { _id: teamId, $expr: { $lt: [{ $size: '$members' }, 4] } },
  { $push: { members: userId } },
  { session, new: true }
);
if (!team) throw new Error('Team full');
await session.commitTransaction();
```
Without the transaction, two concurrent requests could both pass the "is team full?" check and both add themselves — resulting in 5 members.

---

## 🖥 Frontend Deep Dive

### Project Structure
```
client/src/
├── components/
│   ├── Button.jsx
│   ├── ErrorBoundary.jsx      # Class-based, per-section isolation
│   ├── Skeleton.jsx           # CardSkeleton + TableSkeleton
│   ├── VirtualLeaderboard.jsx # @tanstack/react-virtual windowing
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── context/
│   └── AppContext.jsx         # Auth state: token, user, login/logout
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── dashboard/
│   │   ├── DashboardPage.jsx
│   │   ├── TeamView.jsx       # Create/join team
│   │   ├── Round1View.jsx     # Quiz participation
│   │   ├── Round2View.jsx     # Project submission
│   │   ├── PaymentView.jsx    # Payment proof upload
│   │   ├── ResultsView.jsx
│   │   ├── quizTaker.jsx      # Timed quiz with MCQ
│   │   └── TeamDetails.jsx
│   └── admin/
│       ├── AdminDashboardPage.jsx
│       ├── UserManagementView.jsx
│       ├── SubmissionsView.jsx
│       ├── TeamPaymentsView.jsx
│       ├── Round1QuestionsView.jsx
│       ├── Round1ResultsView.jsx
│       ├── Round2SettingsView.jsx
│       └── CertificateView.jsx
└── utils/
    ├── apiClient.js           # Axios + retry + idempotency-key injection
    └── tilt.js                # 3D card tilt effect
```

### Key Frontend Features

**`apiClient.js` — Production-grade Axios instance**
- Auto-injects `Authorization: Bearer <token>` from localStorage
- Auto-injects `Idempotency-Key: <uuid>` on POST/PUT/PATCH
- Exponential backoff with full jitter on 5xx errors and 429 rate-limit responses
- Respects `Retry-After` header from the backend rate limiter

**`VirtualLeaderboard.jsx` — DOM windowing**
- Uses `@tanstack/react-virtual` to render only visible rows
- For 1000+ participants, only ~10 DOM nodes exist at any time
- Eliminates layout jank and memory bloat on the leaderboard page

**`ErrorBoundary.jsx` — Granular fault isolation**
- Wraps individual sections (leaderboard, submissions, payment) independently
- One failing widget does not white-screen the entire app

**`Skeleton.jsx` — Perceived performance**
- Shows `CardSkeleton` and `TableSkeleton` while data is loading
- Eliminates layout shift (CLS) caused by content popping in

---

## ⚡ High-Concurrency Upgrades

### 1. Rate Limiting — Sliding Window via Redis ZSET
```
Request → Remove expired timestamps → Count → If > limit → 429
         ↑ ZADD current timestamp                           ↓
         └───────── EXPIRE window ────────────────── 429 Retry-After
```
- Auth routes: 10 req / 15 min per IP
- Quiz submit: 5 req / 1 min per IP
- Uses Redis atomic `MULTI/EXEC` pipeline — no race conditions

### 2. Idempotency — Redis `SET NX`
```
Request with Idempotency-Key → Redis SET NX (expires 24h)
  - Key absent (first time): proceed, store result
  - Key present (replay): return cached response instantly
```
Prevents double-registration, duplicate quiz submissions, and double-charges.

### 3. Leaderboard — Redis ZSET
```
Score submit → ZADD leaderboard <composite_score> <userId>
            → ZREVRANGE leaderboard 0 99 WITHSCORES
```
Composite score = `score * 1e6 - time_taken_ms` ensures ties broken by speed.
O(log N) insert, O(log N + K) range query vs O(N) full DB scan.

### 4. Cache-Aside — TTL-based
```
GET /questions → Cache HIT? → Return Redis data (< 1ms)
              → Cache MISS? → DB query → Store in Redis (TTL 60s) → Return
POST /questions → Invalidate cache key
```

### 5. BullMQ Job Queue + SSE
```
Quiz submit → Enqueue job (BullMQ) → HTTP 202 Accepted
           ↓                              ↓
       Worker processes            Client opens SSE
       Grades answers              EventEmitter fires
       Updates leaderboard    →    Score pushed to browser
```
Decouples slow grading from fast HTTP response.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register user (rate-limited + idempotent) |
| POST | `/api/auth/login` | — | Login, returns JWT (rate-limited + idempotent) |
| GET | `/api/auth/profile` | JWT | Get current user |

### Teams
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/teams` | JWT | Create team (ACID transaction) |
| GET | `/api/teams` | JWT | List all teams |
| POST | `/api/teams/:id/members` | JWT | Join team (ACID, max 4 members) |
| DELETE | `/api/teams/:id/members/:userId` | Admin | Remove member |

### Quiz (Round 1)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/quiz/submit/1` | JWT | Submit answers (idempotent, queued) |
| GET | `/api/quiz/leaderboard` | — | Redis ZSET leaderboard (top 100) |
| GET | `/api/quiz/submissions/:id/stream` | JWT | SSE stream for grading result |

### Questions (Admin)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/questions` | JWT | List questions by round |
| POST | `/api/questions` | Admin | Add question |
| PUT | `/api/questions/:id` | Admin | Update question |
| DELETE | `/api/questions/:id` | Admin | Delete question |

### Submissions (Round 2)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/submissions/round2` | JWT | Submit project (file upload) |
| GET | `/api/submissions` | Admin | List all submissions |
| POST | `/api/submissions/:id/score` | Admin | Score a submission |

### Payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/payments/submit-proof` | JWT | Upload payment proof |
| GET | `/api/payments` | Admin | List all payments |
| PUT | `/api/payments/:id/verify` | Admin | Approve/reject payment |

### State (Admin)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/state` | — | Get current hackathon round state |
| PUT | `/api/state` | Admin | Update state (open/close rounds) |

---

## 🗄 Database Schema

### User
```js
{ name, email, password (hashed), college, phone, role: ['user','admin'],
  teamId, createdAt }
```

### Team
```js
{ name, members: [ObjectId], leaderId, createdAt }
// max 4 members enforced at DB + application layer
```

### Question
```js
{ text, options: [String], correctAnswer: Number, round: [1,2],
  timeLimit, points }
```

### Submission
```js
{ teamId, round, answers: [{questionId, selected}], score, timeTaken,
  gradedAt, status: ['pending','graded'] }
```

### Payment
```js
{ userId, teamId, amount, proofUrl, status: ['pending','approved','rejected'],
  verifiedBy, createdAt }
```

### State
```js
{ round1Open, round2Open, registrationOpen, updatedAt }
// Singleton — only one document
```

---

## 🧪 Testing

### Test Results (all passing ✅)

**`redis-leaderboard.test.js`** — 3 tests
```
✓ PING Upstash Redis (76ms)
✓ ZSET ranking: scores correctly ordered with tie-breaking (494ms)
✓ Cache-aside: miss populates cache, hit returns cached value (628ms)
```

**`rate-limiter-idempotency.test.js`** — 2 tests
```
✓ Rate limiter blocks 6th request with 429 (341ms)
✓ Idempotency: replay returns same response without re-processing (218ms)
```

**`mongo-atomic-concurrency.test.js`** — 1 test
```
✓ Concurrent join: exactly 1 slot filled, 3 rejected (888ms)
```

### Run Tests
```bash
# Redis + idempotency tests (need network)
npx jest tests/redis-leaderboard.test.js --verbose
npx jest tests/rate-limiter-idempotency.test.js --verbose

# MongoDB ACID concurrency test (run standalone — Atlas latency)
npx jest tests/mongo-atomic-concurrency.test.js --verbose
```

---

## 🚀 Deployment

### Backend — Render (Free Tier)
- **URL:** https://hackathon-website-7e35.onrender.com
- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`
- **Root Directory:** `server`
- Env vars set in Render dashboard (see below)

### Frontend — Vercel
- **Root Directory:** `client`
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Env var:** `VITE_API_URL=https://hackathon-website-7e35.onrender.com/api`

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.yisg7l2.mongodb.net/hackathon2026
REDIS_URL=rediss://default:<pass>@<host>.upstash.io:6379
JWT_SECRET=<your-secret>
NODE_ENV=production
```

### Frontend (`client/.env.production`)
```env
VITE_API_URL=https://hackathon-website-7e35.onrender.com/api
```

> ⚠️ Never commit `.env` files. Both are in `.gitignore`.

---

## 💻 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Upstash Redis account

### 1. Clone
```bash
git clone https://github.com/Krishtiy/Hackathon_website.git
cd Hackathon_website
```

### 2. Backend
```bash
cd server
cp .env.example .env   # fill in your credentials
npm install
npm run dev            # starts on port 5000
```

### 3. Seed Admin
```bash
npm run seed
# Admin: admin@nits.ac.in / admin@1234
```

### 4. Frontend
```bash
cd client
npm install
npm run dev            # starts on port 5173
```

---

## 👩‍💻 Author
**Krishti Singh** — NIT Silchar  
Full-Stack Developer | [GitHub](https://github.com/Krishtiy)

---

## 📄 License
MIT
