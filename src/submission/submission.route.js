import { Router } from "express";
import * as submissionController from "./submission.controller.js";

const router = Router();
router.post("/", submissionController.submit);
export default router;
