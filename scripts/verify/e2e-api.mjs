// End-to-end API test against a RUNNING backend (http://localhost:4000) + seeded local MongoDB.
// Covers: ordering, hidden solution/expectedOutput, grading, solution reveal gating, progress, re-seed safety.
// Usage: docker compose up -d; npm run seed; npm run local; then  node scripts/verify/e2e-api.mjs
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const { lessons } = await import("../lessons.data.js");
const BASE = "http://localhost:4000/api";
const A = `e2e-a-${Date.now()}@example.com`;
const B = `e2e-b-${Date.now()}@example.com`;

let failures = 0;
const check = (name, cond, extra = "") => {
  if (!cond) failures++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  -> " + extra : ""}`);
};
const get = (p) => fetch(BASE + p).then((r) => r.json());
const post = (p, body) =>
  fetch(BASE + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());

// ---- list ----
const list = await get("/lesson");
check("list returns 9 lessons", list.result.length === 9);
check("list is ordered easy→medium→hard", list.result.map((l) => l.level).join(",") === "easy,easy,easy,medium,medium,medium,hard,hard,hard");
check("list omits contentMarkdown", list.result.every((l) => l.contentMarkdown === undefined));
check("list has icon + minutes", list.result.every((l) => l.icon && l.minutes > 0));

// ---- detail (anonymous) ----
const d = await get("/lesson/if-else");
const ex = d.result.exercises[0];
check("detail has long markdown content", d.result.contentMarkdown.length > 3000, `${d.result.contentMarkdown.length} chars`);
check("detail exercise has prompt + hint + starterCode", ex.prompt && ex.hint && ex.starterCode);
check("detail hides solutionCode / explanation", ex.solutionCode === undefined && ex.solutionExplanation === undefined);
check("detail hides expectedOutput", ex.testCases.every((c) => c.expectedOutput === undefined));
check("prev/next present for middle lesson", d.result.prevLesson && d.result.nextLesson && d.result.nextLesson.slug === "loops");
check("exercise.passed=false anonymous", ex.passed === false);

// ---- wrong submission ----
const wrong = await post("/submission", {
  studentName: "A", studentEmail: A, exerciseId: ex._id,
  code: 'import java.util.Scanner;\npublic class Main { public static void main(String[] a){ Scanner s=new Scanner(System.in); s.nextInt(); System.out.println("Even"); } }',
});
check("wrong answer is not passed (1/2)", wrong.result.passed === false && wrong.result.passedCases === 1, `passedCases=${wrong.result.passedCases}`);
check("submission response hides expectedOutput", wrong.result.caseResults.every((c) => c.expectedOutput === undefined));
const afterWrong = await get(`/lesson/if-else?email=${A}`);
check("no solution after a wrong answer", afterWrong.result.exercises[0].solutionCode === undefined && afterWrong.result.exercises[0].passed === false);

// ---- submit correct solutions for all 9 as student A ----
for (const lesson of lessons) {
  const detail = await get(`/lesson/${lesson.slug}`);
  const exercise = detail.result.exercises[0];
  const res = await post("/submission", { studentName: "A", studentEmail: A, exerciseId: exercise._id, code: lesson.exercises[0].solutionCode });
  check(`solution passes: ${lesson.slug}`, res.result.passed === true, `${res.result.passedCases}/${res.result.totalCases}`);
}

// ---- gating after pass ----
const afterPass = await get(`/lesson/if-else?email=${A}`);
const e2 = afterPass.result.exercises[0];
check("solution revealed to the student who passed", e2.passed === true && e2.solutionCode && e2.solutionExplanation);
const viaExercise = await get(`/lesson/exercise/${e2._id}?email=${A}`);
check("exercise endpoint reveals solution to passer", viaExercise.result.solutionCode && viaExercise.result.passed === true);
const otherStudent = await get(`/lesson/exercise/${e2._id}?email=${B}`);
check("other student does NOT get the solution", otherStudent.result.solutionCode === undefined && otherStudent.result.passed === false);
const noEmail = await get(`/lesson/exercise/${e2._id}`);
check("no-email request does NOT get the solution", noEmail.result.solutionCode === undefined);

// ---- progress + completed flags ----
const prog = await get(`/progress?email=${A}`);
check("progress shows 3/3/3 for A", JSON.stringify(prog.result.completedByLevel) === '{"easy":3,"medium":3,"hard":3}');
const listA = await get(`/lesson?email=${A}`);
check("list marks all 9 completed for A", listA.result.every((l) => l.completed));
const listB = await get(`/lesson?email=${B}`);
check("list marks none completed for B", listB.result.every((l) => !l.completed));

// ---- execute / errors ----
const run = await post("/execute", { code: 'public class Main { public static void main(String[] a){ System.out.println("hi"); } }', stdin: "" });
check("execute works", run.result.statusId === 3 && run.result.stdout.trim() === "hi");
const thai = await post("/execute", { code: 'public class Main { public static void main(String[] a){ System.out.println("สวัสดี"); } }', stdin: "" });
check("Thai in a string literal is rejected with a message", thai.status === "fail" && /ภาษาอังกฤษ/.test(thai.message));
const thaiComment = await post("/execute", { code: 'public class Main { public static void main(String[] a){ // ความเห็น\n System.out.println("ok"); } }', stdin: "" });
check("Thai in a comment is allowed", thaiComment.result.statusId === 3);

// ---- re-seed must not wipe progress ----
execSync("npm run seed", { cwd: backendDir, stdio: "pipe" });
const progAfter = await get(`/progress?email=${A}`);
check("progress survives a re-seed", JSON.stringify(progAfter.result.completedByLevel) === '{"easy":3,"medium":3,"hard":3}');
const solAfter = await get(`/lesson/if-else?email=${A}`);
check("solution still available after re-seed", solAfter.result.exercises[0].passed === true && !!solAfter.result.exercises[0].solutionCode);

console.log(`\n${failures === 0 ? "ALL PASSED" : failures + " FAILURE(S)"}`);
