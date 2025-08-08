import { Student } from "../Model/student.model.js";
import {Admin}  from "../Model/admin.model.js";
import { Teacher } from "../Model/teacher.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Create new student
export const createStudent = async (req, res) => {
  try {
    const { name, rollNo, department, school, semester, password } = req.body;
    if (!name || !rollNo || !department || !school || !semester)
      return res.status(400).send("All fields are required");

    const oldstudent = await Student.findOne({ name })
    if (oldstudent) return res.status(400).send("change already exists");

    const hashedPassword = await bcrypt.hash(password, 12)
    if (!hashedPassword) return res.status(404).send("error while creating the hashpass")

    const newStudent = new Student({ name, rollNo, department, school, semester, password: hashedPassword });
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




export const studentSignup = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res.status(400).send("Phone and password are required");

    const existing = await Student.findOne({ phone });
    if (existing) return res.status(400).send("Phone already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // now + 15 min

    const newStudent = new Student({
      phone,
      password: hashedPassword,
      isPhoneVerified: false,
      otp,
      otpExpiry
    });

    await newStudent.save();

    // NOTE: In production, send OTP via SMS provider (e.g. Twilio)

    return res.status(201).json({
      message: "Signup successful. OTP sent to phone.",
      phone,
      otp, // ⚠️ Only for testing. Remove in production
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const verifyStudentOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).send("Phone and OTP are required");

    const student = await Student.findOne({ phone });
    if (!student) return res.status(404).send("Student not found");

    if (student.isPhoneVerified)
      return res.status(400).send("Phone already verified");

    if (student.otp !== otp)
      return res.status(400).send("Invalid OTP");

    if (student.otpExpiry < new Date())
      return res.status(400).send("OTP has expired");

    // ✅ Verification successful
    student.isPhoneVerified = true;
    student.otp = undefined;
    student.otpExpiry = undefined;

    await student.save();

    return res.status(200).json({
      message: "Phone verification successful",
      studentId: student._id
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const handleForgotPassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  // Case 1: Only phone → Send OTP
  if (phone && !otp && !newPassword) {
    const student = await Student.findOne({ phone });
    if (!student) return res.status(404).send("Student not found");

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    student.otp = generatedOtp;
    student.otpExpiry = otpExpiry;
    await student.save();

    // In production, send SMS here
    return res.status(200).json({
      message: "OTP sent to phone for password reset",
      otp: generatedOtp  // ⚠️ remove in production
    });
  }

  // Case 2: All fields provided → Verify & reset password
  if (phone && otp && newPassword) {
    const student = await Student.findOne({ phone });
    if (!student) return res.status(404).send("Student not found");

    if (student.otp !== otp) return res.status(400).send("Invalid OTP");
    if (student.otpExpiry < new Date()) return res.status(400).send("OTP expired");

    const hashed = await bcrypt.hash(newPassword, 10);
    student.password = hashed;

    student.otp = undefined;
    student.otpExpiry = undefined;

    await student.save();

    return res.status(200).send("Password reset successful");
  }

  // If required fields are missing
  return res.status(400).send("Invalid request. Please provide valid inputs.");
};



export const getStudentMarks = async (req, res) => {
  try {
    // const { name, rollNo } = req.body;
    const decode = req.decode
    console.log(decode)
    const student = await Student.findOne({ _id: decode.id })
    if (!student) return res.status(404).send("student not found")

    return res.status(202).send(student.marks)
  } catch (e) {
    return res.status(404).send({ e })
  }
}



export const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Not logged in");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT);
    req.decode = decoded
    next()
  } catch (error) {
    return res.status(404).send(error)
  }

};
export const loginUser = async (req, res) => {
  try {
    const { rollNo, password, type } = req.body;
    const authHeader = req.headers?.authorization;
    

    // Function to get user by ID or rollNo
    const getUser = async (identifier, byId = false) => {
      if (type === "student")
        return byId ? Student.findById(identifier) : Student.findOne({ rollNo: identifier });
      if (type === "teacher")
        return byId ? Teacher.findById(identifier) : Teacher.findOne({ rollNo: identifier });
      if (type === "admin")
        return byId ? Admin.findById(identifier) : Admin.findOne({ rollNo: identifier });
      return null;
    };

    // Handle auto-login
    if (authHeader) {
      const tokenUsed = authHeader.split(" ")[1];
      const decoded = jwt.verify(tokenUsed, process.env.JWT);
      const { id, type } = decoded;

      const user = await getUser(id, true);
      if (!user) return res.status(404).send("Error while auto login");

      return res.status(202).json({ message: "Auto login successful", type });
    }

    // Handle manual login
    if (!type || !rollNo || !password)
      return res.status(400).send("Roll number, password, and type are required");

    const user = await getUser(rollNo);
    if (!user) return res.status(404).send(`${type} not found`);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user._id, type }, process.env.JWT, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      type,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};






