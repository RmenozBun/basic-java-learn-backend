# Java Learn — Backend

Backend API for an interactive Java-learning website aimed at first-year Computer Science students. It stores Java lesson content and per-lesson coding exercises across three difficulty levels, executes student-submitted Java code for real (via the free public [Wandbox](https://wandbox.org) execution API), grades exercise submissions against stored test cases, and tracks each student's progress — identified only by name + email, with no login/password system. The companion frontend (Vue) lives in a separate repository: [basic-java-learn-frontend](https://github.com/RmenozBun/basic-java-learn-frontend).

## Features

- Lesson content across 3 difficulty levels (easy / medium / hard), each with a title, summary, Markdown content, and an ordered list of coding exercises
- Real Java code execution for a free-form "Playground" via Wandbox (`POST /api/execute`), including compile-error, timeout, and runtime-error reporting
- Exercise grading: submitted code is run against every stored test case, with lenient output comparison (case/whitespace/punctuation-insensitive) so beginners aren't penalized for cosmetic differences
- Per-student progress tracking (by name + email, no auth) — which lessons/exercises are completed, broken down by difficulty level
- Safety guard for the Wandbox integration: rejects non-ASCII code/stdin up front (Wandbox silently corrupts non-ASCII bytes) and auto-strips the `public` keyword from `public class Main` so lesson code compiles under Wandbox's fixed `prog.java` filename
- Consistent JSON response envelope (`status`, `code`, `cause`, `message`, `result`) across every endpoint
- A seed script (`scripts/seed.js`) that populates 9 original lessons (3 per level) with worked examples and exercises, written from scratch (topic structure only inspired by the w3schools Java tutorial)

## Tech Stack

- Node.js (ES Modules) + [Express](https://expressjs.com/) 4
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) 8
- [Wandbox](https://wandbox.org) — free, public, no-signup code execution API (wrapped in `src/judge0.js`; the filename is a holdover from an earlier Judge0-based design, kept so callers didn't need to know the execution provider changed)
- `axios`, `cors`, `dotenv`, `http-errors`, `moment` / `moment-timezone`
- `nodemon` (dev dependency, for local auto-reload)
- Docker Compose (MongoDB container for local development only — not used in production)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for a local MongoDB instance), or an existing MongoDB connection string (e.g. MongoDB Atlas)

### Installation

```bash
# 1) Start MongoDB locally
docker compose up -d

# 2) Install dependencies
npm install

# 3) Configure environment variables
# create a .env.local file (see the Environment Variables table below)

# 4) Seed sample lesson data (9 lessons across 3 difficulty levels)
npm run seed
```

### Running

```bash
npm run local   # nodemon, auto-reload — for development
# or
npm start       # plain node — for production
```

The server listens on `http://localhost:4000` by default (`PORT` env var). No extra setup is needed for code execution — Wandbox is a public API called directly over the internet.

### Environment Variables

There is no `.env.example` file in the repository; the variables below were verified from `src/config.js`.

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port Express listens on | `4000` |
| `SUB_PATH` | Prefix mounted in front of every route | `/api` |
| `NODE_ENV` | Environment name | `local` |
| `MONGODB_URI` | Full MongoDB connection string (e.g. a `mongodb+srv://...` Atlas URI); used as-is when set | — |
| `DB_HOST_MONGO` | MongoDB `host:port`, used only when `MONGODB_URI` is not set | `localhost:27017` |
| `DB_NAME_MONGO` | Database name | `java_learn_web` |
| `DB_USER_MONGO` / `DB_PASSWORD_MONGO` | Credentials combined with `DB_HOST_MONGO` into a connection string, used only when `MONGODB_URI` is not set | — |

## API Endpoints

Every response follows the same JSON envelope: `{ "status", "code", "cause", "message", "result" }`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/lesson?level=&email=` | List lessons (optional filter by `level`; pass `email` to include per-lesson completion status) |
| GET | `/api/lesson/:slug?email=` | Lesson detail: content, exercises (with per-exercise pass status if `email` is given), and previous/next lesson |
| GET | `/api/lesson/exercise/:id?email=` | Single exercise detail (without the expected test-case outputs; the model solution + explanation are returned only once that student has passed the exercise) |
| POST | `/api/execute` | Run arbitrary Java code (`{ code, stdin }`) — powers the Playground |
| POST | `/api/submission` | Submit an exercise attempt (`{ studentName, studentEmail, exerciseId, code }`), graded against the exercise's real test cases |
| GET | `/api/progress?email=` | Per-student progress summary, broken down by difficulty level |
| GET | `/api/check` | Basic health check ("Server is running") |

## Project Structure

```text
src/
  app.js              # Express bootstrap
  config.js           # single source of truth for process.env
  connect.js          # MongoDB connection
  index.route.js      # mounts every feature router
  judge0.js           # wraps the Wandbox code-execution API
  timezone.js         # Asia/Bangkok timestamp helper
  model/              # Mongoose schemas (lesson, exercise, submission)
  lesson/             # GET /lesson, /lesson/:slug, /lesson/exercise/:id
  execute/            # POST /execute — run arbitrary code (Playground)
  submission/         # POST /submission — grade an exercise attempt
  progress/           # GET /progress — per-student completion stats
scripts/
  seed.js             # upserts the 9 lessons + exercises into MongoDB (exercise _ids stay stable, so student progress survives re-seeding)
  lessons.data.js     # lesson/exercise metadata, starter + solution code, test cases
  content/            # all teaching content as Markdown: <slug>.md (lesson text), <slug>.exercise-<n>.md (prompt / hint / solution explanation)
  verify/             # dev-only checks: content.mjs, solutions.mjs, e2e-api.mjs (see "Verifying content and the API")
docker-compose.yml    # MongoDB for local development only
```

## Verifying content and the API

```bash
node scripts/verify/content.mjs [file]   # runs every example in the lesson Markdown and compares the output (needs internet)
node scripts/verify/solutions.mjs        # model solutions must pass all test cases; starter code must compile but not pass
node scripts/verify/e2e-api.mjs          # full API test (needs MongoDB + backend running + seeded)
```

## Author

**Theeranat Aiyarakhom** — GitHub: [https://github.com/RmenozBun](https://github.com/RmenozBun)

---

## ภาษาไทย

Backend API ของเว็บไซต์เรียนภาษา Java แบบ interactive สำหรับนักศึกษาสาขาวิทยาการคอมพิวเตอร์ชั้นปีที่ 1 ระบบนี้เก็บเนื้อหาบทเรียนและแบบฝึกหัดเขียนโค้ดของแต่ละบทเรียน แบ่งเป็น 3 ระดับความยาก รันโค้ด Java ที่ผู้ใช้เขียนจริงผ่าน [Wandbox](https://wandbox.org) (บริการรันโค้ดสาธารณะฟรี) ตรวจคำตอบแบบฝึกหัดเทียบกับชุดทดสอบที่เก็บไว้ และติดตามความคืบหน้าของผู้เรียนแต่ละคน — โดยระบุตัวตนด้วยชื่อและอีเมลเท่านั้น ไม่มีระบบล็อกอิน/รหัสผ่าน ส่วนหน้าบ้าน (frontend, เขียนด้วย Vue) อยู่คนละ repository: [basic-java-learn-frontend](https://github.com/RmenozBun/basic-java-learn-frontend)

### คุณสมบัติ

- เนื้อหาบทเรียน 3 ระดับความยาก (ง่าย / กลาง / ยาก) แต่ละบทมีชื่อเรื่อง สรุปย่อ เนื้อหาแบบ Markdown และรายการแบบฝึกหัดเรียงลำดับ
- รันโค้ด Java จริงสำหรับหน้า "Playground" อิสระผ่าน Wandbox (`POST /api/execute`) พร้อมรายงานข้อผิดพลาดคอมไพล์ การรันเกินเวลา และข้อผิดพลาดขณะรัน
- ตรวจแบบฝึกหัด: รันโค้ดที่ส่งมาเทียบกับทุกชุดทดสอบที่เก็บไว้ โดยเปรียบเทียบผลลัพธ์แบบผ่อนปรน (ไม่สนตัวพิมพ์เล็ก-ใหญ่ ช่องว่าง หรือเครื่องหมายวรรคตอน) เพื่อไม่ให้ผู้เริ่มต้นเสียคะแนนจากความต่างเล็กน้อยที่ไม่กระทบตรรกะ
- ติดตามความคืบหน้าของผู้เรียนแต่ละคน (ระบุด้วยชื่อ+อีเมล ไม่ต้องล็อกอิน) ว่าเรียน/ทำแบบฝึกหัดไหนผ่านแล้วบ้าง แยกตามระดับความยาก
- กลไกป้องกันสำหรับการเชื่อมต่อ Wandbox: ปฏิเสธโค้ด/stdin ที่มีอักขระนอก ASCII ตั้งแต่ต้น (เพราะ Wandbox จะทำให้ไบต์นอก ASCII เพี้ยนโดยไม่แจ้งเตือน) และตัดคำว่า `public` ออกจาก `public class Main` อัตโนมัติ เพื่อให้คอมไพล์ผ่านภายใต้ชื่อไฟล์ `prog.java` ที่ Wandbox กำหนดตายตัว
- รูปแบบ response แบบเดียวกันทุก endpoint (`status`, `code`, `cause`, `message`, `result`)
- สคริปต์ seed ข้อมูล (`scripts/seed.js`) ที่ใส่บทเรียนตัวอย่างต้นฉบับ 9 บท (ระดับละ 3 บท) พร้อมตัวอย่างและแบบฝึกหัด (เขียนขึ้นเอง ได้แรงบันดาลใจด้านโครงสร้างหัวข้อจาก w3schools Java Tutorial เท่านั้น)

### เทคโนโลยีที่ใช้

- Node.js (ES Modules) + [Express](https://expressjs.com/) 4
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) 8
- [Wandbox](https://wandbox.org) — บริการรันโค้ดสาธารณะฟรี ไม่ต้องสมัคร (ห่อหุ้มไว้ใน `src/judge0.js` ชื่อไฟล์เป็นร่องรอยจากดีไซน์เดิมที่เคยใช้ Judge0 คงชื่อไว้เพื่อไม่ให้ส่วนอื่นต้องรู้ว่าเปลี่ยนผู้ให้บริการรันโค้ดแล้ว)
- `axios`, `cors`, `dotenv`, `http-errors`, `moment` / `moment-timezone`
- `nodemon` (dev dependency สำหรับ auto-reload ตอนพัฒนา)
- Docker Compose (คอนเทนเนอร์ MongoDB สำหรับการพัฒนาในเครื่องเท่านั้น ไม่ได้ใช้ตอน production)

### เริ่มต้นใช้งาน

**สิ่งที่ต้องมีก่อน**

- Node.js 18 ขึ้นไป
- Docker (สำหรับรัน MongoDB ในเครื่อง) หรือ connection string ของ MongoDB ที่มีอยู่แล้ว (เช่น MongoDB Atlas)

**การติดตั้ง**

```bash
# 1) รัน MongoDB ในเครื่อง
docker compose up -d

# 2) ติดตั้ง dependencies
npm install

# 3) ตั้งค่าตัวแปรแวดล้อม
# สร้างไฟล์ .env.local (ดูตารางตัวแปรแวดล้อมด้านล่าง)

# 4) ใส่ข้อมูลบทเรียนตัวอย่าง (9 บท ใน 3 ระดับความยาก)
npm run seed
```

**การรัน**

```bash
npm run local   # nodemon, auto-reload — สำหรับพัฒนา
# หรือ
npm start       # node ธรรมดา — สำหรับ production
```

เซิร์ฟเวอร์จะฟังที่ `http://localhost:4000` โดยค่าเริ่มต้น (ตัวแปร `PORT`) ไม่ต้องตั้งค่าอะไรเพิ่มสำหรับการรันโค้ด เพราะ Wandbox เป็น public API ที่เรียกผ่านอินเทอร์เน็ตได้ทันที

**ตัวแปรแวดล้อม**

ใน repository ไม่มีไฟล์ `.env.example` ตัวแปรด้านล่างนี้ตรวจสอบยืนยันมาจากไฟล์ `src/config.js`

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|---|---|---|
| `PORT` | พอร์ตที่ Express ฟัง | `4000` |
| `SUB_PATH` | prefix ของทุก route | `/api` |
| `NODE_ENV` | ชื่อ environment | `local` |
| `MONGODB_URI` | connection string เต็มรูปแบบ (เช่น `mongodb+srv://...` ของ Atlas) ถ้าตั้งค่านี้จะใช้ทันที | — |
| `DB_HOST_MONGO` | host:port ของ MongoDB ใช้เฉพาะเมื่อไม่ได้ตั้ง `MONGODB_URI` | `localhost:27017` |
| `DB_NAME_MONGO` | ชื่อฐานข้อมูล | `java_learn_web` |
| `DB_USER_MONGO` / `DB_PASSWORD_MONGO` | ข้อมูลรับรองตัวตนใช้ร่วมกับ `DB_HOST_MONGO` เพื่อประกอบ connection string ใช้เฉพาะเมื่อไม่ได้ตั้ง `MONGODB_URI` | — |

### API Endpoints

ทุก response ใช้รูปแบบเดียวกัน: `{ "status", "code", "cause", "message", "result" }`

| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/api/lesson?level=&email=` | รายการบทเรียน (กรองตาม `level` ได้ ส่ง `email` เพื่อดูสถานะเรียนจบแต่ละบท) |
| GET | `/api/lesson/:slug?email=` | รายละเอียดบทเรียน เนื้อหา แบบฝึกหัด (พร้อมสถานะผ่าน/ไม่ผ่านถ้าส่ง `email`) และบทก่อนหน้า/ถัดไป |
| GET | `/api/lesson/exercise/:id?email=` | รายละเอียดแบบฝึกหัดเดี่ยว (ไม่รวมผลลัพธ์ที่คาดหวังของชุดทดสอบ และจะส่งเฉลยพร้อมคำอธิบายให้เฉพาะผู้เรียนที่ผ่านข้อนี้แล้ว) |
| POST | `/api/execute` | รันโค้ด Java อิสระ (`{ code, stdin }`) — ใช้กับหน้า Playground |
| POST | `/api/submission` | ส่งคำตอบแบบฝึกหัด (`{ studentName, studentEmail, exerciseId, code }`) ตรวจกับชุดทดสอบจริงของแบบฝึกหัดนั้น |
| GET | `/api/progress?email=` | สรุปความคืบหน้าของผู้เรียนรายคน แยกตามระดับความยาก |
| GET | `/api/check` | ตรวจสอบสถานะเซิร์ฟเวอร์เบื้องต้น ("Server is running") |

### โครงสร้างโปรเจกต์

```text
src/
  app.js              # จุดเริ่มต้นของ Express
  config.js           # แหล่งรวมค่า process.env ทั้งหมด
  connect.js          # การเชื่อมต่อ MongoDB
  index.route.js      # รวม router ของทุกฟีเจอร์
  judge0.js           # ห่อหุ้ม Wandbox code-execution API
  timezone.js         # ตัวช่วยแปลงเวลาโซน Asia/Bangkok
  model/              # Mongoose schema (lesson, exercise, submission)
  lesson/             # GET /lesson, /lesson/:slug, /lesson/exercise/:id
  execute/            # POST /execute — รันโค้ดอิสระ (Playground)
  submission/         # POST /submission — ตรวจคำตอบแบบฝึกหัด
  progress/           # GET /progress — สรุปความคืบหน้าของผู้เรียน
scripts/
  seed.js             # เพิ่ม/อัปเดตบทเรียน 9 บท พร้อมแบบฝึกหัดลง MongoDB (ID ของแบบฝึกหัดคงที่ ความคืบหน้าผู้เรียนจึงไม่หายเมื่อ seed ซ้ำ)
  lessons.data.js     # metadata บทเรียน/แบบฝึกหัด โค้ดตั้งต้น โค้ดเฉลย และชุดทดสอบ
  content/            # เนื้อหาสอนทั้งหมดเป็น Markdown: <slug>.md (เนื้อหาบท), <slug>.exercise-<n>.md (โจทย์ / คำใบ้ / คำอธิบายเฉลย)
  verify/             # สคริปต์ตรวจสอบสำหรับนักพัฒนา: content.mjs, solutions.mjs, e2e-api.mjs (ดูหัวข้อ "ตรวจสอบเนื้อหาและ API")
docker-compose.yml    # MongoDB สำหรับการพัฒนาในเครื่องเท่านั้น
```

### ตรวจสอบเนื้อหาและ API

```bash
node scripts/verify/content.mjs [file]   # รันทุกโค้ดตัวอย่างในบทเรียนแล้วเทียบผลลัพธ์ (ต้องต่ออินเทอร์เน็ต)
node scripts/verify/solutions.mjs        # เฉลยต้องผ่านทุกชุดทดสอบ โค้ดตั้งต้นต้องคอมไพล์ได้แต่ยังไม่ผ่าน
node scripts/verify/e2e-api.mjs          # ทดสอบ API ครบวงจร (ต้องรัน MongoDB + backend และ seed ก่อน)
```

### ผู้พัฒนา

**ธีรนาถ อัยราคม** — GitHub: [https://github.com/RmenozBun](https://github.com/RmenozBun)
