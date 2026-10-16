import authModel from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
}



// Registration Api

export async function Registeration(req,res) {
  let { name, email, phone, password, role } = req.body;

  if (role === "admin") {
    const existingAdmin = await authModel.findOne({ role: "admin" })
    if (existingAdmin) {
      return res.json({ success: false, msg: "The one admin is already present" })
    }
  }

  const normalizedEmail = email?.trim().toLowerCase();

  let existingEmail = await authModel.findOne({ email: normalizedEmail });
  if (existingEmail) {
    return res.json({ success: false, msg: "This email is already exist" });
  }

  let phoneNumber = await authModel.findOne({phone:phone})
  if(phoneNumber){
    return res.json({success:false, msg:"This phone number is already taken"})
  }

    let hashPassword = await bcrypt.hash(password, 10);

    let registerUser = await authModel.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashPassword,
      role
    });


    let token = {
        id: registerUser._id,
        role: registerUser.role
    }

    let tokenData = jwt.sign(token, "maxyy");
    res.cookie("Soler-system", tokenData, authCookieOptions)
 
    return res.json({
      success: true,
      msg: "The api is working",
      registerUser: registerUser,
    });
  
}


// login api


export async function login(req,res){
  let {email, password, role} = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  let existingData = await authModel.findOne({ email: normalizedEmail, role })
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
  res.cookie("Soler-system", tokenData, authCookieOptions)

  return res.json({success:true, msg:"You are logged successfully"})
}








export async function authCheck(req, res) {
  try {
    let token = req.cookies["Soler-system"]

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Please login first"
      })
    }

    let decoded = jwt.verify(token, "maxyy")
    let user = await authModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User not found"
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired login"
    })
  }
}

export function logout(req, res) {
  res.clearCookie("Soler-system", authCookieOptions)
  return res.status(200).json({
    success: true,
    msg: "Logged out successfully"
  })
}
