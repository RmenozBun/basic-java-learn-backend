import ProgressService from "./progress.service.js";

export const getByEmail = async (req, res) => {
  try {
    const result = await new ProgressService().getByEmail(req.query.email);
    return res.status(200).send({
      status: "success",
      code: 1,
      cause: "",
      message: "ดึงข้อมูลความคืบหน้าสำเร็จ",
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
