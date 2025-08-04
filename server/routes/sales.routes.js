import { Router } from "express";
import {
  cotiAll,
  dataCoti,
  editCoti,
  saveCoti,
} from "../controllers/sales.controller.js";

const router = Router();

router.post("/cotinsert", saveCoti);
router.get("/datacoti/:id", dataCoti);
router.put("/dataedit/:id", editCoti);
router.get("/datacoti", cotiAll);
export default router;
