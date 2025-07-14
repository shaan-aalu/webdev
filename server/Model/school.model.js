import mongoose from "mongoose";

const schoolschema = new mongoose.Schema({
    name: { type:String, required:true},
    address: {type:String,required:true},
    department: [{
        type: mongoose.Schema.Types.ObjectId, ref:"Dept"
    }]

})
export const School = mongoose.model("School",schoolschema);