import { Router } from "express";
import authRoutes, { loginLimiter } from "./auth.routes.js";
import salesRoutes from "./sales.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/sales", salesRoutes);

export default router;
