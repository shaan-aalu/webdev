import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  updateStudentMarks,
  getFilteredStudents,
  deleteStudent,
  updateStudent,
  uploadMarks,
  getStudentMarks

} from "../Controller/student.controller.js";

const studentrouter = Router();

studentrouter.post("/createStudent", createStudent);
studentrouter.get("/getAllStudents", getAllStudents);
studentrouter.post("/updateStudentMarks", updateStudentMarks);
studentrouter.delete("/deleteStudent/:studentId", deleteStudent);
studentrouter.get("/getFilteredStudents", getFilteredStudents);
studentrouter.put("/updateStudent/:studentId", updateStudent)
studentrouter.post("/uploadMarks", uploadMarks);
studentrouter.post("/getStudentMarks", getStudentMarks);


export { studentrouter };
