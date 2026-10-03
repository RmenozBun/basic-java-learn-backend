// Every exercise: the model solution must pass all test cases, the starter code must compile but not pass.
// Usage: node scripts/verify/solutions.mjs   (needs internet; no database needed)
const { lessons } = await import("../lessons.data.js");
const { default: Judge0Service } = await import("../../src/judge0.js");
const runner = new Judge0Service();
const normalize = (t) => (t || "").toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

let bad = 0;
for (const lesson of lessons) {
  for (const ex of lesson.exercises) {
    // solution must pass every test case
    let passed = 0;
    for (const tc of ex.testCases) {
      const r = await runner.runJava(ex.solutionCode, tc.stdin);
      if (r.statusId === 3 && normalize(r.stdout) === normalize(tc.expectedOutput)) passed++;
    }
    const solOk = passed === ex.testCases.length;

    // starter code must compile, and must NOT already pass everything
    const s = await runner.runJava(ex.starterCode, ex.testCases[0].stdin);
    const compiles = s.statusId !== 6;
    let starterPasses = 0;
    for (const tc of ex.testCases) {
      const r = await runner.runJava(ex.starterCode, tc.stdin);
      if (r.statusId === 3 && normalize(r.stdout) === normalize(tc.expectedOutput)) starterPasses++;
    }
    const starterAlreadyPasses = starterPasses === ex.testCases.length;

    const ok = solOk && compiles && !starterAlreadyPasses;
    if (!ok) bad++;
    console.log(
      `${ok ? "ok   " : "ISSUE"} ${lesson.slug}#${ex.order}: solution ${passed}/${ex.testCases.length}, starter compiles=${compiles}, starterAlreadyPasses=${starterAlreadyPasses}`,
    );
  }
}
console.log(`done, ${bad} problem(s)`);
