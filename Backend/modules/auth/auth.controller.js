import authModel from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"



// Registration Api

export async function Registeration(req,res) {
  let { name, email, phone, password, role } = req.body;

  let existingEmail = await authModel.findOne({ email: email });
  if (existingEmail) {
    return res.json({ success: false, msg: "This email is already exist" });
  }

  let phoneNumber = await authModel.findOne({phone:phone})
  if(phoneNumber){
    return res.json({success:false, msg:"This phone number is already taken"})
  }

  if (role == "Admin") {
    let existingAdmin = await authModel.findOne({ role: "Admin" });
    if(existingAdmin){
        return res.json({success:false, msg:"The one admin is already present"})
    }
   }
    let hashPassword = await bcrypt.hash(password, 10);

    let registerUser = await authModel.create({
      name,
      email,
      phone,
      password: hashPassword,
      role
    });


    let token = {
        id: registerUser._id,
        role: registerUser.role
    }

     console.log(token, "The token is here")

     let tokenData = jwt.sign(token, "maxyy");
     res.cookie("Soler-system", tokenData)
 
    return res.json({
      success: true,
      msg: "The api is working",
      registerUser: registerUser,
    });
  
}


// login api


export async function login(req,res){
  let {email, password, role} = req.body;

  let existingData = await authModel.findOne({email,role})
  if(!existingData){
    return res.json({success:false, msg:"The email or role is not found"})
  }

  let hashPassword = existingData.password;
  let result = await bcrypt.compare(password, hashPassword)
  if(!result){
    return res.json({success:false, msg:"This password is incorrect"})
  }

  let token = {
    id:existingData._id,
    role:existingData.role
  }

  let tokenData = jwt.sign(token, "maxyy")
  res.cookie("Soler-system", tokenData)

  return res.json({success:true, msg:"You are logged successfully"})
}
