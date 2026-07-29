import express from "express";
import orchestrator from "../agents/orchestrator.js";

const router = express.Router();

router.post("/", orchestrator);

export default router;