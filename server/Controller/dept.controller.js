import { Dept } from "../Model/dept.model.js";
import { School } from "../Model/school.model.js";

export const createDept = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(404).send("field are required")

        const oldept = await Dept.findOne({ name })

        if (oldept) return res.status(404).send("change name")

        const newdept = new Dept({ name })

        if (!newdept) return res.status(404).send("error while writing dept")

        const save = await newdept.save()

        if (!save) return res.status(404).send("error during saving")
        console.log("first")
        return res.status(202).send("dept created")

    } catch (error) {
        return res.status(404).send({ error })
    }
}

export const updatedept = async(req,res) =>
{
    try {
         const {deptID} = req.params;
        const {deptName} = req.body;
        if(!deptID || !deptName ) return res.status(404).send("nothings here")
               
        const oldschool = await Dept.findById(deptID)
        if(!oldschool) return res.status(404).send("not found")

        await Dept.updateOne({ _id:deptID  }, { $set: { name:deptName } })

        
        return res.status(200).send("updated details")
        
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const addTeacher = async(req,res) => {

    try {
        const { deptID } = req.params;
        const { Teachers } = req.body;
            
        if(!deptID) return res.status(404).send("id not found")
        
        const oldDept = await Dept.findOne({_id:deptID})
        if(!oldDept) return res.status(404).send("dept not here")

        //const existingTeachers = oldDept.Teachers.map(t => t.toString());
           const existingTeachers = oldDept.Teachers.map((t) => {
            
           return t.toString() 

        });

        const newTeachers = Teachers.filter(
        id => !existingTeachers.includes(id.toString())
        );

        if (newTeachers.length === 0)
        return res.status(409).send("All teachers already added");   

        await Dept.updateOne(
            {_id:deptID},
            {$push:{Teachers:{$each:newTeachers}}}
        )
        return res.status(200).send("teacher added")

    } catch (error) {
        return res.status(404).send({error})
    }
}
export const deleteTeacherFromDept = async (req, res) => {
    try {
        const { deptID} = req.params;
        const { Teachers } = req.body;
        if (!deptID) return res.status(404).send("deptId not found")

       const olddept = await Dept.findById(deptID); 

        if (!olddept) return res.status(404).send("dept not found")

        const existingTeachers = olddept.Teachers.map(t => t.toString());//map jeta iterator aase oita re direct print korre

        const newTeachers = Teachers.filter(//filter iterator re dekhe if defined and true taile hi hoye(condition check kore)Returns a new array containing only the elements that match a condition

        id => existingTeachers.includes(id.toString())  //Checks if a single value exists in an array.

        );

        if (newTeachers.length === 0)
        return res.status(409).send("All teachers already deleted");   

        await Dept.updateOne({ _id: deptID },{$pull: { Teachers: { $in: newTeachers} }}
)

        return res.status(202).send("Dep removed !!")
    } catch (error) {
        return res.status(404).send(error)
    }
}

export const getTeacher = async(req,res) => {
    try {
        const{deptID} = req.params
        if(!deptID) return res.status(400).send("no schoolid")

        const oldteacher = await Dept.findOne({_id:deptID})
        if(!oldteacher) return res.status(400).send("no school found")

        return res.status(200).send(oldteacher.Teachers)
    } catch (error) {
        return res.status(400).send(error)
    }
}


export const getAlldept = async (req,res) => {
    try {
        const alldept = await Dept.find({})
        return res.status(202).send(alldept) //array
    } catch (error) {
        return res.status(404).send(error)
    }
}


//updatedept