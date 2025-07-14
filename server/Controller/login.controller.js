import { Login } from "../Model/login.model.js";

export const  signup = async(req,res) => {
try {
    const {name,password}=req.body;

    const salt = await bcrypt.genSalt(10)

    const hashedpassword = await bcrypt.hash(password,salt);

    // const //

} catch (error) {
    
}
}