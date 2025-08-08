import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true }
});

export const Admin = mongoose.model("Admin", adminSchema);

