import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  subjectname: { type: String, required: true },
  score: { type: Number, required: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  semester: { type: Number },
  marks: [markSchema],
});

export const Student = mongoose.model("Student", studentSchema);

