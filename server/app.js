import express from "express";
import cors from "cors"
import morgan from "morgan"
import connect from "./db.js";
import "dotenv/config"
import { schoolrouter } from "./Router/school.router.js";
import { deptrouter } from "./Router/dept.router.js";
import { teacherouter } from "./Router/teacher.router.js";
import { loginrouter } from "./Router/login.router.js";
import { studentrouter } from "./Router/student.router.js";
const app = express();

app.use(express.json());
app.use(cors("*"))
app.use(deptrouter)
app.use(schoolrouter)
app.use(teacherouter)
app.use(loginrouter)
app.use(studentrouter)

connect().then(() => {

    app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});