import { Router } from "express";
import * as progressController from "./progress.controller.js";

const router = Router();
router.get("/", progressController.getByEmail);
export default router;
