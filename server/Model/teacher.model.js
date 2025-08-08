import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }
});

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  subject: [subjectSchema],
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
