import { Teacher } from "../Model/teacher.model.js"

export const createTeacher = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Name is required");

        const existingTeacher = await Teacher.findOne({ name });
        if (existingTeacher) return res.status(409).send("Teacher already exists");

        const newTeacher = new Teacher({ name, subject: [] });
        const saved = await newTeacher.save();

        return res.status(201).send(saved);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


export const getAllteacher = async (req, res) => {
    try {
        //console.log(first)
        const allteacher = await Teacher.find({})
        return res.status(202).send(allteacher) //array
    } catch (error) {
        return res.status(404).send(error)
    }
}


export const updateTeacher = async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        if (!oldName || !newName) return res.status(400).send("Both names are required");

        const teacher = await Teacher.findOne({ name: oldName });
        if (!teacher) return res.status(404).send("Teacher not found");

        teacher.name = newName;
        await teacher.save();

        return res.status(200).send("Teacher name updated");
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


export const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        if (!teacherId) return res.status(400).send("teacherId is required");

        const deleted = await Teacher.findOneAndDelete({ _id: teacherId });
        if (!deleted) return res.status(404).send("Teacher not found");

        return res.status(200).send("Teacher deleted");
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

export const addSubjectsToTeacher = async (req, res) => {
    try {
        const { teacherId, subjects } = req.body;

        if (!teacherId || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).send("teacherId and valid subjects array required");
        }



        subjects.map(sub => {

            if (sub.semester < 0 || sub.semester > 11) {
                return res.status(400).send("Subject count must be between 1 and 10");
            }
        })



        const teacher = await Teacher.findOne({ _id: teacherId });
        if (!teacher) return res.status(404).send("Teacher not found");

        for (const sub of subjects) {
            if (!sub.name || !sub.semester) {
                return res.status(400).send("Each subject must have name and semester");
            }
            console.log(teacher)
            teacher.subject.push({ subjectName: sub.name, semester: sub.semester });
        }

        await teacher.save();
        return res.status(200).send("Subjects added");
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


export const deleteSubjectFromTeacher = async (req, res) => {
  try {
    const { teacherId, subjectIds } = req.body;

    if (!teacherId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).send("teacherId and subjectIds (array) are required");
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).send("Teacher not found");

    teacher.subject = teacher.subject.filter(
      sub => !subjectIds.includes(sub._id.toString())
    );

    await teacher.save();

    return res.status(200).send("Subjects removed");
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


export const getAllSubjects = async (req, res) => {
  try {
    const teachers = await Teacher.find({}, 'subject'); // only fetch 'subject' field

    // Flatten all subjects into one array
    const allSubjects = teachers.flatMap(t => t.subject);

    return res.status(200).send(allSubjects);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


