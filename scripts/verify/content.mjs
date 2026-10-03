// Runs every runnable `java` block in scripts/content/*.md through the real code runner and compares
// the output with the following `output`/`error` block. Usage: node scripts/verify/content.mjs [file-substring]
// (needs internet: calls Wandbox; no database needed)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { default: Judge0Service } = await import("../../src/judge0.js");
const contentDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content");
const only = process.argv[2]; // optional: filter by file name substring

const normLines = (text) =>
  (text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .join("\n")
    .trim();

const parseBlocks = (md) => {
  const blocks = [];
  const re = /```([^\n]*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const [langRaw = "", ...attrParts] = m[1].trim().split(/\s+/);
    const attrs = {};
    attrParts.forEach((a) => {
      const i = a.indexOf("=");
      if (i > 0) attrs[a.slice(0, i)] = a.slice(i + 1);
    });
    blocks.push({ lang: langRaw, attrs, body: m[2], start: m.index, end: m.index + m[0].length });
  }
  return blocks;
};

const runner = new Judge0Service();
const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md") && (!only || f.includes(only)));
let total = 0;
let problems = 0;

for (const file of files) {
  const md = fs.readFileSync(path.join(contentDir, file), "utf8");
  const blocks = parseBlocks(md);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.lang !== "java" || b.attrs.run === "no") continue;
    total++;
    const stdin = b.attrs.stdin ? decodeURIComponent(b.attrs.stdin) : "";
    const next = blocks[i + 1];
    const followedByOutput =
      next && ["output", "error"].includes(next.lang) && md.slice(b.end, next.start).trim() === "";
    const label = `${file} #${total} (line ~${md.slice(0, b.start).split("\n").length})`;

    let res;
    try {
      res = await runner.runJava(b.body, stdin);
    } catch (e) {
      console.log(`ISSUE ${label}: runner threw ${e.message}`);
      problems++;
      continue;
    }

    const expectKind = b.attrs.expect || "ok";
    let ok = true;
    let detail = "";
    if (expectKind === "compile-error") {
      ok = res.statusId === 6;
      detail = `status=${res.statusId} compile=${(res.compileOutput || "").split("\n").slice(0, 2).join(" | ")}`;
    } else if (expectKind === "error") {
      ok = res.statusId !== 3 && res.statusId !== 6;
      detail = `status=${res.statusId} stderr=${(res.stderr || "").split("\n")[0]}`;
      if (followedByOutput && next.lang === "error") {
        const got = normLines(res.stderr.split("\n").filter((l) => !l.trim().startsWith("at ")).join("\n"));
        const want = normLines(next.body);
        if (got !== want) {
          ok = false;
          detail += `\n   WANT: ${want}\n   GOT : ${got}`;
        }
      }
    } else {
      ok = res.statusId === 3;
      detail = `status=${res.statusId} ${res.statusDescription} ${res.compileOutput ? "compile=" + res.compileOutput.split("\n")[0] : ""} ${res.stderr ? "stderr=" + res.stderr.split("\n")[0] : ""}`;
      if (ok && followedByOutput && next.lang === "output") {
        const got = normLines(res.stdout);
        const want = normLines(next.body);
        if (got !== want) {
          ok = false;
          detail += `\n   WANT:\n${want}\n   GOT:\n${got}`;
        }
      }
    }
    if (!ok) {
      problems++;
      console.log(`ISSUE ${label} [expect=${expectKind}]: ${detail}`);
    } else {
      console.log(`ok    ${label}${followedByOutput ? " (output matched)" : ""}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}
console.log(`\nChecked ${total} runnable java blocks, ${problems} problem(s).`);
