import { createTeacher,updateTeacher, getAllteacher,deleteTeacher,addSubjectsToTeacher,deleteSubjectFromTeacher,getAllSubjects
} from "../Controller/teacher.controller.js";
import { Router } from "express";

const teacherouter=Router()


teacherouter.post("/createTeacher",createTeacher)
teacherouter.post("/addSubjectsToTeacher",addSubjectsToTeacher)
teacherouter.put("/deleteSubjectFromTeacher",deleteSubjectFromTeacher)
teacherouter.post("/updateTeacher/:teacherID",updateTeacher)
teacherouter.get("/getAllteacher", getAllteacher)
teacherouter.put("/deleteTeacher/:teacherId", deleteTeacher)
teacherouter.get("/getAllSubjects",getAllSubjects)


export {teacherouter}