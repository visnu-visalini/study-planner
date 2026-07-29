import express from "express";
import tutor from "../agents/tutor.js";

const router = express.Router();

router.post("/", tutor);

export default router;