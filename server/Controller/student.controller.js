import { Student } from "../Model/student.model.js";

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { name, rollNo, department, school, semester } = req.body;
    if (!name || !rollNo || !department || !school || !semester)
      return res.status(400).send("All fields are required");

    const oldstudent = await Student.findOne({ name })
    if (oldstudent) return res.status(400).send("change already exists");

    const newStudent = new Student({ name, rollNo, department, school, semester });
    const saved = await newStudent.save();

    return res.status(201).send(saved);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const allstudents = await Student.find({})
    return res.status(202).send(allstudents) //array
  } catch (error) {
    return res.status(404).send(error)
  }
}


export const updateStudentMarks = async (req, res) => {
  try {
    const { studentId, marks } = req.body;

    if (!studentId || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).send("studentId and marks array are required");
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send("Student not found");

    for (const { subject, score } of marks) {
      if (!subject) continue;

      const existing = student.marks.find(m => m.subject === subject);
      if (existing) {
        existing.score = score;
      } else {
        student.marks.push({ subject, score });
      }
    }

    await student.save();
    return res.status(200).send("Marks updated successfully");
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const deleted = await Student.findByIdAndDelete(studentId);
    if (!deleted) return res.status(404).send("Student not found");

    return res.status(200).send("Student deleted");
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


export const getFilteredStudents = async (req, res) => {
  try {
    const { schoolId, departmentId, semester } = req.query;

    if (!schoolId || !departmentId || !semester) {
      return res.status(400).send("schoolId, departmentId, and semester are required");
    }

    const students = await Student.find({
      school: schoolId,
      department: departmentId,
      semester: parseInt(semester),
    }).populate("school").populate("department");

    return res.status(200).send(students);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, rollNo, department, school, semester } = req.body;

    if (!name || !rollNo || !department || !school || !semester)
      return res.status(400).send("All fields are required");

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { name, rollNo, department, school, semester },
      { new: true }
    );

    if (!updated) return res.status(404).send("Student not found");
    return res.status(200).send(updated);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


export const uploadMarks = async (req, res) => {
  try {
    const { studentId, SubjectName, Marks } = req.body;

    if (!studentId || !SubjectName || Marks === undefined) {
      return res.status(400).send("Missing required fields");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Check if subject already exists in marks
    const existingMark = student.marks.find(
      (mark) => mark.subjectname.toLowerCase() === SubjectName.toLowerCase()
    );

    if (existingMark) {
      // Update existing subject score
      existingMark.score = Marks;
    } else {
      // Add new mark
      student.marks.push({
        subjectname: SubjectName,
        score: Marks,
      });
    }

    await student.save();

    return res.status(200).json({
      message: "Marks uploaded successfully",
      updatedMarks: student.marks,
    });

  } catch (error) {
    console.error("Upload mark error:", error);
    return res.status(500).send("Internal Server Error");
  }
};



export const getStudentMarks = async (req, res) => {
  try {
    const { name, rollNo } = req.body;
    const student = await Student.findOne({ name, rollNo })
    if (!student) return res.status(404).send("student not found")

    return res.status(202).send(student.marks)
  } catch (e) {
    return res.status(404).send({ e })
  }
}