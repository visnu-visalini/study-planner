import express from "express";
import planner from "../agents/planner.js";

const router = express.Router();

router.post("/", planner);

export default router;