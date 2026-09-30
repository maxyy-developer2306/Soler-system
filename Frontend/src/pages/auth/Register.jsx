import React from "react";
import { UserPlus, User, Mail, Lock, Phone, UserCog } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  let navigate = useNavigate()
  let [msg, setMsg]= useState ("")

  let [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

 async function registeration() {
  try {
    let responce = await axios.post(
      import.meta.env.VITE_backend_Url + "/user/register",
      formdata,{
        withCredentials: true
      }
    );

    console.log(responce);

    setMsg(responce.data.msg);

    if (responce.data.success == true) {
      navigate("/products");
    }
  } catch (error) {
    console.log(error);
  }
}
  

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-100 rounded-lg border border-gray-200 bg-white p-8 mt-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your BLH Property account
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <User size={17} className="text-gray-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, name: e.target.value });
              }}
              type="text"
              placeholder="Enter your name"
              className="h-full w-full outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <Mail size={17} className="text-gray-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, email: e.target.value });
              }}
              type="email"
              placeholder="Enter your email"
              className="h-full w-full outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <Phone size={17} className="text-gray-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, phone: e.target.value });
              }}
              type="Number"
              placeholder="Enter your phone"
              className="h-full w-full outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <Lock size={17} className="text-gray-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, password: e.target.value });
              }}
              type="password"
              placeholder="Create your password"
              className="h-full w-full outline-none text-sm"
            />
          </div>

          <label className="mt-3 block text-sm font-medium text-gray-700">
            Role
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <UserCog size={17} className="text-gray-500" />

            <select
              onChange={function (e) {
                setFormdata({ ...formdata, role: e.target.value });
              }}
              className="h-full w-full bg-white outline-none text-sm"
            >
              <option value="user">Select Role</option>
              <option value="user">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <button
        onClick={function(){
          registeration()
        }}
          className="h-9 cursor-pointer w-full flex items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white hover:bg-gray-900"
        >
          <UserPlus size={17} />
          Create Account
        </button>
         
        <p className="text-red-600 mt-2 text-center">{msg}</p>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-gray-900 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
