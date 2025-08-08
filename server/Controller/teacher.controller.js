import { Teacher } from "../Model/teacher.model.js"

// controllers/teacherController.js
import bcrypt from 'bcryptjs';


export const createTeacher = async (req, res) => {
  try {
    const { name, password, rollNo } = req.body;

    // 1) validate inputs
    if (!name || !password || !rollNo) {
      return res
        .status(400)
        .json({ message: 'name, password and rollNo are all required.' });
    }

    // 2) check for existing name OR rollNo
    const exists = await Teacher.findOne({
      $or: [{ name }, { rollNo }]
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: 'A teacher with that name or rollNo already exists.' });
    }

    // 3) hash the password
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    // 4) create & save
    const teacher = new Teacher({
      name,
      password: hashed,
      rollNo,
      subject: []  // start with no subjects
    });
    await teacher.save();

    // 5) respond (omit password)
    return res.status(201).json({
      message: 'Teacher created successfully.',
      teacher: { 
        id: teacher._id,
        name: teacher.name,
        rollNo: teacher.rollNo
      }
    });
  } catch (err) {
    console.error('createTeacher error:', err);
    return res.status(500).json({ message: err.message });
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


