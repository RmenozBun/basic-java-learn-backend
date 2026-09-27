import LessonService from "./lesson.service.js";

export const list = async (req, res) => {
  try {
    const result = await new LessonService().list(req.query.level, req.query.email);
    return res.status(200).send({
      status: "success",
      code: 1,
      cause: "",
      message: "ดึงรายการบทเรียนสำเร็จ",
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

export const getOne = async (req, res) => {
  try {
    const result = await new LessonService().getOne(req.params.slug, req.query.email);
    return res.status(200).send({
      status: "success",
      code: 1,
      cause: "",
      message: "ดึงข้อมูลบทเรียนสำเร็จ",
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

export const getExercise = async (req, res) => {
  try {
    const result = await new LessonService().getExercise(req.params.id);
    return res.status(200).send({
      status: "success",
      code: 1,
      cause: "",
      message: "ดึงข้อมูลแบบฝึกหัดสำเร็จ",
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
