import ExecuteService from "./execute.service.js";

export const run = async (req, res) => {
  try {
    const { code, stdin } = req.body;
    const result = await new ExecuteService().run(code, stdin);
    return res.status(200).send({
      status: "success",
      code: 1,
      cause: "",
      message: "รันโค้ดสำเร็จ",
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
