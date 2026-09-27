import { Router } from "express";
import lessonRoute from "./lesson/lesson.route.js";
import executeRoute from "./execute/execute.route.js";
import submissionRoute from "./submission/submission.route.js";
import progressRoute from "./progress/progress.route.js";

const router = Router();
router.use("/lesson", lessonRoute);
router.use("/execute", executeRoute);
router.use("/submission", submissionRoute);
router.use("/progress", progressRoute);
export default router;
