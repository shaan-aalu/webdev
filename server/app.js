import express from "express";
import cors from "cors"
import morgan from "morgan"
import connect from "./db.js";
import "dotenv/config"
import { schoolrouter } from "./Router/school.router.js";
import { deptrouter } from "./Router/dept.router.js";
import { teacherouter } from "./Router/teacher.router.js";
import { studentrouter } from "./Router/student.router.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5174", // your React frontend origin
  credentials: true
}));

app.use(deptrouter)
app.use(schoolrouter)
app.use(teacherouter)
app.use(studentrouter)


connect().then(() => {

    app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});