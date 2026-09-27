import mongoose from "mongoose";
import resError from "http-errors";
import ExerciseModel from "../model/exercise.model.js";
import SubmissionModel from "../model/submission.model.js";
import Judge0Service, { describeStatus } from "../judge0.js";

// Lenient on purpose: beginners shouldn't fail an exercise over a missing
// comma or a capital letter when the program logic is otherwise correct.
// Strips common sentence punctuation, collapses whitespace, and ignores
// case before comparing actual vs. expected output.
const normalize = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export default class SubmissionService {
  async submit({ studentName, studentEmail, exerciseId, code }) {
    if (!studentName || !studentEmail) throw resError(400, "กรุณาระบุชื่อและอีเมลก่อนส่งคำตอบ");
    if (!code || !code.trim()) throw resError(400, "กรุณาเขียนโค้ดก่อนส่งคำตอบ");
    if (!mongoose.isValidObjectId(exerciseId)) throw resError(404, "ไม่พบแบบฝึกหัดนี้");

    const exercise = await ExerciseModel.findById(exerciseId).lean();
    if (!exercise) throw resError(404, "ไม่พบแบบฝึกหัดนี้");

    const judge0 = new Judge0Service();
    const testCases = exercise.testCases.length ? exercise.testCases : [{ stdin: "", expectedOutput: "" }];

    // Every test case is reported back (input/actual output/pass-fail), not
    // just a pass/fail count, so a student can see exactly which case failed
    // and what their code actually produced. `expectedOutput` is kept only
    // in the DB record for our own review — never in the API response —
    // otherwise a student could just copy the "correct" answer instead of
    // fixing their code.
    const caseResults = [];
    for (const testCase of testCases) {
      const run = await judge0.runJava(code, testCase.stdin);
      const casePassed = run.statusId === 3 && normalize(run.stdout) === normalize(testCase.expectedOutput);
      caseResults.push({
        stdin: testCase.stdin,
        expectedOutput: testCase.expectedOutput,
        actualOutput: run.stdout || run.stderr || run.compileOutput || "",
        passed: casePassed,
        statusDescription: describeStatus(run.statusId, run.statusDescription),
      });
      // A compile error is identical for every remaining case (same source
      // code) — stop early instead of burning more Wandbox requests.
      if (run.statusId === 6) break;
    }

    const passedCases = caseResults.filter((result) => result.passed).length;
    const passed = passedCases === testCases.length;

    const submission = await SubmissionModel.create({
      studentName,
      studentEmail,
      exerciseId,
      code,
      passed,
      totalCases: testCases.length,
      passedCases,
      caseResults,
    });

    const result = submission.toObject();
    result.caseResults = result.caseResults.map(({ expectedOutput, ...rest }) => rest);
    return result;
  }
}
