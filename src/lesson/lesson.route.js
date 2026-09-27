import { Router } from "express";
import * as lessonController from "./lesson.controller.js";

const router = Router();
router.get("/", lessonController.list);
router.get("/exercise/:id", lessonController.getExercise);
router.get("/:slug", lessonController.getOne);
export default router;
