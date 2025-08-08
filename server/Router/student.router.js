import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  updateStudentMarks,
  getFilteredStudents,
  deleteStudent,
  updateStudent,
  uploadMarks,
  getStudentMarks,
  studentSignup,
  verifyStudentOtp,
  handleForgotPassword,
  loginUser,
  checkAuth

} from "../Controller/student.controller.js";


const studentrouter = Router();

studentrouter.post("/createStudent", createStudent);
studentrouter.get("/getAllStudents", getAllStudents);
studentrouter.post("/updateStudentMarks", updateStudentMarks);
studentrouter.delete("/deleteStudent/:studentId", deleteStudent);
studentrouter.get("/getFilteredStudents", getFilteredStudents);
studentrouter.put("/updateStudent/:studentId", updateStudent)
studentrouter.post("/uploadMarks", uploadMarks);
studentrouter.get("/getStudentMarks", checkAuth, getStudentMarks);
studentrouter.post("/studentSignup", studentSignup);
studentrouter.post("/verifyStudentOtp", verifyStudentOtp);
studentrouter.post("/handleForgotPassword", handleForgotPassword);
// studentrouter.post("/checkAuth",checkAuth)


studentrouter.post('/loginUser', loginUser)
export { studentrouter };
