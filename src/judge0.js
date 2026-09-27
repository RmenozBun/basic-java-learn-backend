import axios from "axios";
import resError from "http-errors";

// This wraps Wandbox (https://wandbox.org/api/compile.json) — a free, public,
// no-signup code execution API. We switched away from self-hosted Judge0
// because it needs cgroup v1, which Docker Desktop on Windows/WSL2 doesn't
// provide by default (cgroup v2), and the public Judge0/Piston APIs are
// either paid or now whitelist-only. The synthesized statusId values below
// mirror Judge0 CE's own status.id convention (3=Accepted, 5=Time Limit
// Exceeded, 6=Compilation Error, >=7 runtime error) purely so the rest of
// the backend (execute/submission services) doesn't need to know which
// provider is behind this file.
const STATUS_MESSAGE_TH = {
  6: "คอมไพล์โค้ดไม่ผ่าน",
  5: "โค้ดทำงานนานเกินเวลาที่กำหนด",
};

export const describeStatus = (statusId, fallback) => STATUS_MESSAGE_TH[statusId] || fallback;

const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const WANDBOX_JAVA_COMPILER = "openjdk-jdk-21+35";

// Wandbox always compiles the submitted source as "prog.java" — a *public*
// top-level "Main" class fails javac's "class Main is public, should be
// declared in a file named Main.java" check under that fixed filename, even
// though every lesson/starter code in this app teaches "public class Main"
// as the standard convention. Stripping just that one `public` keyword here
// (server-side, invisible to students) keeps the convention intact
// everywhere else.
const stripPublicMain = (sourceCode) => sourceCode.replace(/\bpublic(\s+class\s+Main\b)/, "$1");

// Wandbox silently mangles every non-ASCII byte to "?" — in source code AND
// stdin — with no request-side encoding fix available (confirmed by testing
// directly against their API: even a single accented character comes back
// corrupted). Rather than let students hit a confusing wall of "?"s, fail
// fast with an explanation. Revisit this if the code-execution provider is
// ever swapped for one that handles UTF-8 (e.g. a self-hosted Judge0, which
// sidesteps this entirely by transporting source/stdin/stdout as base64).
const NON_ASCII = /[^\x00-\x7F]/;

// Comments never reach program output, so Thai text in a guidance comment
// (every starter code template has one, e.g. "// เขียนโค้ดของคุณตรงนี้") is
// harmless even though Wandbox would still mangle it — only flag non-ASCII
// that could actually affect what the program prints.
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

export default class Judge0Service {
  async runJava(sourceCode, stdin = "") {
    if (NON_ASCII.test(stripComments(sourceCode)) || NON_ASCII.test(stdin)) {
      throw resError(
        400,
        "ระบบรันโค้ดขณะนี้รองรับเฉพาะภาษาอังกฤษในโค้ดและ input เท่านั้น (ยังไม่รองรับภาษาไทยหรืออักขระพิเศษอื่นๆ)",
      );
    }

    try {
      const { data } = await axios.post(
        WANDBOX_URL,
        {
          code: stripPublicMain(sourceCode),
          compiler: WANDBOX_JAVA_COMPILER,
          stdin,
        },
        { timeout: 20000 },
      );

      if (data.compiler_error) {
        return {
          statusId: 6,
          statusDescription: "Compilation Error",
          stdout: "",
          stderr: "",
          compileOutput: data.compiler_error,
          time: null,
          memory: null,
        };
      }

      if (data.signal) {
        return {
          statusId: 5,
          statusDescription: `Killed (${data.signal})`,
          stdout: data.program_output || "",
          stderr: data.program_error || "",
          compileOutput: "",
          time: null,
          memory: null,
        };
      }

      const isAccepted = data.status === "0";
      return {
        statusId: isAccepted ? 3 : 7,
        statusDescription: isAccepted ? "Accepted" : "Runtime Error",
        stdout: data.program_output || "",
        stderr: data.program_error || "",
        compileOutput: "",
        time: null,
        memory: null,
      };
    } catch (error) {
      if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw resError(503, "ระบบรันโค้ดไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      }
      throw resError(500, "เกิดข้อผิดพลาดในการรันโค้ด");
    }
  }
}
