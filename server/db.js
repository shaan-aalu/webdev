import mongoose from "mongoose";
import "dotenv/config"

const DB=process.env.DB;
console.log(DB)

const connect = async () => {
    const database = await mongoose.connect(DB,{
    })
    console.log("Db connect")
    return database;
}
export default connect