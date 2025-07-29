import { Router } from "express";
import { saveCoti } from "../controllers/sales.controller.js";

const router = Router();

router.post("/cotinsert", saveCoti);

export default router;
