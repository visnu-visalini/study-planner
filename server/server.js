import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import plannerRoute from "./routes/planner.js";
import tutorRoute from "./routes/tutor.js";
import trackerRoute from "./routes/tracker.js";
import executorRoute from "./routes/executor.js";
import orchestratorRoute from "./routes/orchestrator.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/planner", plannerRoute);
app.use("/tutor", tutorRoute);
app.use("/tracker", trackerRoute);
app.use("/executor", executorRoute);
app.use("/orchestrator", orchestratorRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});