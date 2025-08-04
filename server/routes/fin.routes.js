import { Router } from "express";
import {
  saveIngreso,
  categorias,
  saveEgreso,
} from "../controllers/fin.controller.js";

const router = Router();

router.get("/categorias/:id", categorias); // Endpoint to get categories by ID
router.post("/income", saveIngreso);
router.post("/expense", saveEgreso);

export default router;
