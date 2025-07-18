import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  subjectname: { type: String, required: true },
  score: { type: Number, required: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String },                  // optional
  rollNo: { type: String },                // optional
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  semester: { type: Number },              // optional
  marks: [markSchema],

  password: { type: String},
});

export const Student = mongoose.model("Student", studentSchema);
