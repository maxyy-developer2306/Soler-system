import React from "react";
import { LogIn, Mail, Lock, UserCog } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  let navigate = useNavigate()

    let [msg, setMsg]= useState ("")
  
  let [login, setLogin] = useState({
    email: "",
    password: "",
    role: "",
  });

  async function Loginuser(){
    let responce = await axios.post(import.meta.env.VITE_backend_Url + "/user/login", login,
      {
        withCredentials:true
      }
    )
    console.log(responce)
    setLogin(responce.data)
     setMsg(responce.data.msg);
    if(responce.data.success==true){
      navigate("/products")
    }
  }
 
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-100 rounded-lg border border-gray-200 bg-white p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Login</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your BLH Property account
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2  text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <Mail size={17} className="text-gray-500" />

            <input
            onChange={function (e) {
                setLogin({ ...login, email: e.target.value });
              }}
              type="email"
              placeholder="Enter your email"
              className="h-full w-full outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2  text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <Lock size={17} className="text-gray-500" />

            <input
            onChange={function (e) {
                setLogin({ ...login, password: e.target.value });
              }}
              type="password"
              placeholder="Enter your password"
              className="h-full w-full outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2  text-sm font-medium text-gray-700">
            Login As
          </label>

          <div className="h-10 flex items-center gap-2 rounded-md border border-gray-300 px-3">
            <UserCog size={17} className="text-gray-500" />

            <select
            onChange={function (e) {
                setLogin({ ...login, role: e.target.value });
              }}
            className="h-full w-full bg-white outline-none text-sm">
              <option value="user">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button 
       onClick={Loginuser}
        className="h-9 cursor-pointer w-full flex items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white hover:bg-gray-900">
          <LogIn size={17} />
          Login
        </button>

         <p className="text-red-600 mt-2 text-center">{msg}</p>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-900 font-medium hover:underline"
          >
            SignUp
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
