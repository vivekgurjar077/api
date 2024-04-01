import express from "express";
import {
  createreqtutor,
  deletereqtutor,
  getreqtutor,
  getreqtutors
} from "../controllers/reqtutor.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/",  createreqtutor);
router.delete("/:id", verifyToken, deletereqtutor);
router.get("/single/:id", getreqtutor);
router.get("/", getreqtutors);

export default router;
