import SubmissionService from "./submission.service.js";

export const submit = async (req, res) => {
  try {
    const result = await new SubmissionService().submit(req.body);
    return res.status(201).send({
      status: "success",
      code: 1,
      cause: "",
      message: result.passed ? "ยินดีด้วย! คำตอบถูกต้อง" : "คำตอบยังไม่ถูกต้องทั้งหมด ลองอีกครั้ง",
      result,
    });
  } catch (error) {
    return res.status(error.status || 500).send({
      status: "fail",
      code: 0,
      cause: "",
      message: error.message,
      result: {},
    });
  }
};
