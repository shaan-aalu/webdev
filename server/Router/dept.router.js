import { Router } from "express";
import { createDept,updatedept,addTeacher,deleteTeacherFromDept,getTeacher,getAlldept} from "../Controller/dept.controller.js";

const deptrouter = Router()
deptrouter.post("/createDept",createDept)
deptrouter.post("/addTeacher/:deptID",addTeacher)
 deptrouter.put("/deleteTeacherFromDept/:deptID",deleteTeacherFromDept)
deptrouter.get("/getTeacher/:deptID",getTeacher)
deptrouter.post("/updatedept/:deptID",updatedept)
deptrouter.get("/getAlldept",getAlldept)
export {deptrouter}