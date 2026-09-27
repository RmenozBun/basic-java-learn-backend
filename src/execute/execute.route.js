import { Router } from "express";
import * as executeController from "./execute.controller.js";

const router = Router();
router.post("/", executeController.run);
export default router;
