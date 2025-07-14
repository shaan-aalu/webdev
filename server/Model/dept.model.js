import mongoose from "mongoose";

const deptschema = new mongoose.Schema({
    name: { type: String },
    Teachers: [{
        type: mongoose.Schema.ObjectId, ref: "Teacher"
    }]
})

export const Dept = mongoose.model("Dept", deptschema)