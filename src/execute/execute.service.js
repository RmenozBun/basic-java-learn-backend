import resError from "http-errors";
import Judge0Service, { describeStatus } from "../judge0.js";

export default class ExecuteService {
  async run(sourceCode, stdin) {
    if (!sourceCode || !sourceCode.trim()) throw resError(400, "กรุณาเขียนโค้ดก่อนรัน");

    const result = await new Judge0Service().runJava(sourceCode, stdin);
    return {
      statusId: result.statusId,
      statusDescription: describeStatus(result.statusId, result.statusDescription),
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      time: result.time,
      memory: result.memory,
    };
  }
}
