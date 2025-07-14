import { Router } from "express";
import { createschool, addDept, deleteDept, getDeptBySchool, deleteSchool, updateschool, getAllSchool } from "../Controller/school.controller.js";

const schoolrouter = Router()

schoolrouter.post("/createSchool", createschool)
schoolrouter.delete("/deleteSchool/:schoolId", deleteSchool)
schoolrouter.post("/updateschool/:schoolId", updateschool)

schoolrouter.post("/addDept/:schoolId", addDept)
schoolrouter.put("/deleteDept/:schoolId", deleteDept)

schoolrouter.get("/getDeptBySchool/:schoolId", getDeptBySchool)
schoolrouter.get("/getAllSchool", getAllSchool)


export { schoolrouter }