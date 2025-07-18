import { School } from "../Model/school.model.js";//
import { Dept } from "../Model/dept.model.js";
//update,delete

export const createschool = async (req, res) => {
    try {
        const { name, address } = req.body;
        console.log(name)
        if (!name || !address) return res.status(404).send("Field are required")


        const oldSchool = await School.findOne({ name })
        if (oldSchool) return res.status(404).send("Change the name")

        const newschool = new School({ name, address })
        if (!newschool) return res.status(404).send("Error while creating the school")


        const save = await newschool.save()
        if (!save) return res.status(404).send("Eror while saving thwe school data")

        return res.status(202).send("School created ", newschool)
    } catch (error) {
        return res.status(404).send("error " + error)
    } 
}


export const deleteSchool = async(req,res) =>{
    try {
        const {schoolId}=req.params;
        if(!schoolId) return res.status(404).send("schoolid nahi hai")

        const oldschool = School.findOne({_id: schoolId})
        if(!oldschool) return res.status(404).send("school nhi hai")

        await School.deleteOne({_id:schoolId});

        return res.status(200).send("school deleted")


    } catch (error) {
        return res.status(400).send(error)
    }
}

export const updateschool = async(req,res) =>
{
    try {
         const {schoolId} = req.params;
        const {name,address} = req.body;
        if(!schoolId || !name || !address) return res.status(404).send("nothings here")
               
        const oldschool = await School.findById(schoolId)
        if(!oldschool) return res.status(404).send( "school not found")

         await School.updateOne({ _id:schoolId  }, { $set: { name, address } })

        
        return res.status(200).send("updated details")
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const addDept = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { department } = req.body;
        if (!schoolId) return res.status(404).send("SchoolId not found")

        const oldSchool = await School.findOne({ _id: schoolId })
        if (!oldSchool) return res.status(404).send("School not found")
       

        const exists = department.some(depId =>
            oldSchool.department.map(d => d.toString()).includes(depId.toString())
        );

        if(exists)  return res.status(404).send("Dept is already added")
        await School.updateOne({ _id: schoolId }, { $push: { department:{$each:department} } })

        return res.status(202).send("Dep added !!")
    } catch (error) {
        return res.status(404).send({ error })
    }
}
export const deleteDept = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { department } = req.body;
        if (!schoolId) return res.status(404).send("SchoolId not found")

        const oldSchool = await School.findOne({ _id: schoolId })
        if (!oldSchool) return res.status(404).send("School not found")
            
            const exists = department.some(depId =>// issue over here is that if true for any single condition it will stop adding and removing others
            oldSchool.department.map(d => d.toString()).includes(depId.toString())
        );

        if(!exists)  return res.status(404).send("Dept is already deleted")

        await School.updateOne({ _id: schoolId },{$pull: { department: { $in: department } }}
)

        return res.status(202).send("Dep removed !!")
    } catch (error) {
        return res.status(404).send(error)
    }
}

export const getDeptBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;

        if (!schoolId) return res.status(404).send("SchoolId not found");

        const school = await School.findOne({ _id: schoolId });
        if (!school) return res.status(404).send("School not found");

        return res.status(200).send(school.department); // returns array of IDs
    } catch (error) {
        return res.status(500).send({ error });
    }
};

export const getAllSchool = async (req,res) => {
  try {
    // Step 1: Get all schools and populate departments
    const schools = await School.find({}).populate("department");

    // Step 2: Populate teachers inside each department
    for (const school of schools) {
      for (const dept of school.department) {
        const populatedDept = await Dept.findById(dept._id).populate("Teachers");
        dept.Teachers = populatedDept.Teachers;
      }
    }

    return res.status(200).send(schools);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}