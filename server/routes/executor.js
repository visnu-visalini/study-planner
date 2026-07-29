import express from "express";
import executor from "../agents/executor.js";

const router = express.Router();

router.post("/", executor);

export default router;