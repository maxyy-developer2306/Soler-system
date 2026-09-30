import mongoose from "mongoose"


let userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    role: String
})

let authModel = mongoose.model("user", userSchema)

export default authModel