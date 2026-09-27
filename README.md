# Java Learn — Backend

API หลังบ้านของเว็บเรียนภาษา Java แบบ interactive สำหรับนักศึกษา comsci ปี 1 | Backend API for an interactive Java learning site for first-year CS students.

หน้าบ้าน (frontend) อยู่คนละ repo: https://github.com/RmenozBun/basic-java-learn-frontend
The frontend lives in a separate repo: https://github.com/RmenozBun/basic-java-learn-frontend

## สิ่งที่โปรเจกต์นี้ทำ | What this does

- เก็บเนื้อหาบทเรียน Java 3 ระดับ (ง่าย/กลาง/ยาก) และแบบฝึกหัดแต่ละบท
- รันโค้ด Java ที่ผู้ใช้เขียนจริงผ่าน [Wandbox](https://wandbox.org) (บริการรันโค้ดฟรีสาธารณะ ไม่ต้องสมัคร ไม่ต้อง self-host)
- ตรวจคำตอบแบบฝึกหัดเทียบกับชุดทดสอบที่เก็บไว้ พร้อมติดตามความคืบหน้าต่อผู้เรียน (ระบุตัวตนด้วยชื่อ+อีเมล ไม่มีระบบล็อกอิน/รหัสผ่าน)

---

- Stores Java lesson content across 3 difficulty levels (easy/medium/hard) with exercises per lesson
- Executes user-submitted Java code for real via [Wandbox](https://wandbox.org) (a free, public, no-signup code execution API)
- Grades exercise submissions against stored test cases and tracks per-student progress (identified by name + email only — no login/password system)

## Stack

- Node.js + Express (ES Modules)
- MongoDB + Mongoose
- Wandbox (external code execution API, wrapped in `src/judge0.js`)

## โครงสร้างโปรเจกต์ | Project structure

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
  seed.js             # seeds 9 lessons (3 levels x 3) with exercises into MongoDB
docker-compose.yml    # MongoDB for local development only
```

## เริ่มรันในเครื่อง | Local development

ต้องมี Node.js 18+ และ Docker (สำหรับ MongoDB) | Requires Node.js 18+ and Docker (for local MongoDB).

```bash
# 1) MongoDB
docker compose up -d

# 2) Backend
npm install
cp .env.local.example .env.local   # ถ้ามี ปรับค่าตามต้องการ | if present, adjust as needed
npm run seed      # ใส่เนื้อหาบทเรียนตัวอย่าง 9 บท | seed 9 sample lessons
npm run local     # http://localhost:4000
```

ไม่ต้องตั้งค่าอะไรสำหรับการรันโค้ด Java — Wandbox เป็น public API เรียกผ่านอินเทอร์เน็ตได้ทันที
No setup needed for code execution — Wandbox is a public API called directly over the internet.

## Environment variables

| Variable | คำอธิบาย | Description | Default |
|---|---|---|---|
| `PORT` | พอร์ตที่ Express ฟัง | Port Express listens on | `4000` |
| `SUB_PATH` | prefix ของทุก route | Prefix for all routes | `/api` |
| `NODE_ENV` | environment name | environment name | `local` |
| `MONGODB_URI` | connection string เต็มรูปแบบ (ใช้กับ MongoDB Atlas เช่น `mongodb+srv://...`) | full connection string (use with MongoDB Atlas e.g. `mongodb+srv://...`) | — |
| `DB_HOST_MONGO` | host:port ของ MongoDB (ใช้เมื่อไม่ได้ตั้ง `MONGODB_URI`) | MongoDB host:port (used when `MONGODB_URI` isn't set) | `localhost:27017` |
| `DB_NAME_MONGO` | ชื่อฐานข้อมูล | database name | `java_learn_web` |

## API overview

ทุก response ใช้รูปแบบเดียวกัน | Every response follows the same envelope:

```json
{ "status": "success", "code": 1, "cause": "", "message": "...", "result": { } }
```

| Method | Path | คำอธิบาย | Description |
|---|---|---|---|
| GET | `/api/lesson?level=&email=` | รายการบทเรียน (กรองตามระดับได้, ส่ง email เพื่อดูสถานะเรียนจบ) | List lessons (optional level filter; pass email to include completion status) |
| GET | `/api/lesson/:slug?email=` | รายละเอียดบทเรียน + แบบฝึกหัด + บทก่อนหน้า/ถัดไป | Lesson detail + exercises + prev/next lesson |
| GET | `/api/lesson/exercise/:id` | รายละเอียดแบบฝึกหัดเดี่ยว | Single exercise detail |
| POST | `/api/execute` | รันโค้ด Java อิสระ (`{ code, stdin }`) — ใช้กับหน้า Playground | Run arbitrary Java code (`{ code, stdin }`) — powers the Playground |
| POST | `/api/submission` | ส่งคำตอบแบบฝึกหัดตรวจกับ test case จริง (`{ studentName, studentEmail, exerciseId, code }`) | Submit an exercise attempt, graded against real test cases |
| GET | `/api/progress?email=` | สรุปความคืบหน้าของผู้เรียนรายคน | Per-student progress summary |

## ⚠️ ข้อจำกัดของ Wandbox | Wandbox limitations

- รองรับเฉพาะภาษาอังกฤษ (ASCII) ในโค้ด/stdin เท่านั้น — ตรวจจับและแจ้งเตือนไว้แล้วใน `src/judge0.js`
  Only ASCII (English) is supported in code/stdin — this is detected and reported by `src/judge0.js`.
- ไม่มี SLA/rate-limit ชัดเจน เหมาะกับงานระดับห้องเรียน/เดโม ถ้าต้องรองรับผู้ใช้พร้อมกันจำนวนมากควรพิจารณาย้ายไป self-host Judge0 บนเซิร์ฟเวอร์ Linux จริง
  No formal SLA/rate limit — fine for classroom/demo scale; consider self-hosting Judge0 on a real Linux server if you need to support many concurrent users.

## Deploy ฟรี | Free deployment

ดูขั้นตอนละเอียดในหัวข้อถัดไป — สรุปสั้นๆ: deploy backend นี้ขึ้น **Render** (free web service) และใช้ **MongoDB Atlas** (free M0 tier) เป็นฐานข้อมูล ไม่ต้องใช้ Docker ตอน production เลย (`docker-compose.yml` มีไว้สำหรับ local dev เท่านั้น)

See the detailed steps below — in short: deploy this backend to **Render** (free web service) with **MongoDB Atlas** (free M0 tier) as the database. No Docker is needed in production (`docker-compose.yml` is for local development only).

### ขั้นตอน Deploy | Deployment steps

**1. MongoDB Atlas**

1. สมัครฟรีที่ | Sign up free at https://www.mongodb.com/cloud/atlas/register
2. สร้าง cluster แบบ **M0 Free** | Create an **M0 Free** cluster
3. สร้าง Database User (username/password) ที่เมนู Database Access | Create a Database User under Database Access
4. ที่เมนู Network Access กด "Allow Access from Anywhere" (`0.0.0.0/0`) | Under Network Access, allow access from anywhere (`0.0.0.0/0`)
5. กด "Connect" → "Drivers" จะได้ connection string | Click "Connect" → "Drivers" to get the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/java_learn_web?retryWrites=true&w=majority
   ```

**2. Render (backend)**

1. Push repo นี้ขึ้น GitHub (ทำไปแล้ว) | Push this repo to GitHub (already done)
2. ไปที่ | Go to https://render.com → "New +" → "Web Service"
3. เชื่อม repo นี้ ตั้งค่า | Connect this repo, configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. เพิ่ม Environment Variables | Add environment variables:
   ```env
   MONGODB_URI=<connection string จากขั้นตอนที่ 1 | from step 1>
   DB_NAME_MONGO=java_learn_web
   SUB_PATH=/api
   NODE_ENV=production
   ```
   (ไม่ต้องตั้ง `PORT` เอง Render กำหนดให้อัตโนมัติ | don't set `PORT` — Render provides it automatically)
5. Deploy แล้วจะได้ URL แบบ | You'll get a URL like `https://your-app.onrender.com`
6. รัน seed ข้อมูลครั้งเดียวผ่าน Render Shell tab | Seed the lesson data once via the Render Shell tab:
   ```bash
   npm run seed
   ```

⚠️ Render free tier จะ sleep เมื่อไม่มีคนใช้ ~15 นาที คำขอแรกหลัง sleep จะช้ากว่าปกติ (cold start)
Render's free tier sleeps after ~15 minutes of inactivity; the first request after sleeping will be slower (cold start).

จากนั้นเอา URL backend นี้ไปตั้งเป็น `API_BASE_URL` ในฝั่ง frontend (ดู README ของ frontend repo)
Then use this backend URL as `API_BASE_URL` on the frontend side (see the frontend repo's README).
