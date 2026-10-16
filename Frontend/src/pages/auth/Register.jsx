import React from "react";
import { UserPlus, User, Mail, Lock, Phone, UserCog, Sun } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* Panel Navy #0B1F3A | Cell Blue #1E4E8C | Sun #FFC233 | Sky Wash #EAF2F8 */

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap');
.sp-display { font-family: 'Bricolage Grotesque', 'Segoe UI', sans-serif; letter-spacing: -0.02em; }
.sp-body { font-family: 'Instrument Sans', 'Segoe UI', sans-serif; }

.sp-cells-light {
  background-color: #EAF2F8;
  background-image:
    linear-gradient(rgba(30,78,140,0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,78,140,0.09) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: sp-drift 60s linear infinite;
}
@keyframes sp-drift { from { background-position: 0 0; } to { background-position: 48px 48px; } }

@keyframes sp-glow { 0%,100% { transform: scale(1); opacity: .85 } 50% { transform: scale(1.12); opacity: 1 } }
.sp-glow { animation: sp-glow 6s ease-in-out infinite; }

@keyframes sp-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.sp-rise { animation: sp-rise .8s cubic-bezier(.2,.7,.2,1) both; }

@keyframes sp-spin { to { transform: rotate(360deg); } }
.sp-spin { animation: sp-spin 24s linear infinite; transform-origin: center; }

@keyframes sp-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.sp-msg { animation: sp-fade .3s ease both; }

.sp-field { transition: border-color .2s ease, box-shadow .2s ease; }
.sp-field:focus-within { border-color: #1E4E8C; box-shadow: 0 0 0 3px rgba(30,78,140,.15); }
.sp-focus:focus-visible { outline: 3px solid #FFC233; outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .sp-cells-light, .sp-glow, .sp-spin, .sp-rise, .sp-msg { animation: none !important; }
}
`;

function Register() {
  let navigate = useNavigate()
  let [msg, setMsg]= useState ("")

  let [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
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
      navigate("/Products_managment");
    }
  } catch (error) {
    setMsg(
      error.response?.data?.msg ||
      "Registration failed. Please try again later."
    );
  }
}
  

  return (
    <div className="sp-body sp-cells-light relative overflow-hidden min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="sp-glow absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FFC233]/40 blur-3xl pointer-events-none" />
      <div
        className="sp-glow absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-[#1E4E8C]/20 blur-3xl pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <div className="sp-rise relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <span className="w-10 h-10 rounded-full bg-[#0B1F3A] inline-flex items-center justify-center mb-4">
            <Sun size={20} className="sp-spin text-[#FFC233]" />
          </span>
          <h1 className="sp-display text-2xl font-bold text-[#0B1F3A]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create your BLH Property account
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <div className="sp-field h-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
            <User size={16} className="text-slate-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, name: e.target.value });
              }}
              type="text"
              placeholder="Enter your name"
              className="h-full w-full outline-none text-sm bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>

          <div className="sp-field h-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
            <Mail size={16} className="text-slate-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, email: e.target.value });
              }}
              type="email"
              placeholder="Enter your email"
              className="h-full w-full outline-none text-sm bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <div className="sp-field h-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
            <Phone size={16} className="text-slate-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, phone: e.target.value });
              }}
              type="Number"
              placeholder="Enter your phone"
              className="h-full w-full outline-none text-sm bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="sp-field h-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
            <Lock size={16} className="text-slate-500" />

            <input
              onChange={function (e) {
                setFormdata({ ...formdata, password: e.target.value });
              }}
              type="password"
              placeholder="Create your password"
              className="h-full w-full outline-none text-sm bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Role
          </label>

          <div className="sp-field h-10 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
            <UserCog size={16} className="text-slate-500" />

            <select
              onChange={function (e) {
                setFormdata({ ...formdata, role: e.target.value });
              }}
              className="h-full w-full bg-transparent outline-none text-sm"
            >
              <option value="user">Select Role</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <button
        onClick={function(){
          registeration()
        }}
          className="sp-focus h-9 cursor-pointer w-full flex items-center justify-center gap-2 rounded-md bg-[#0B1F3A] text-sm font-medium text-white hover:bg-[#12305a] active:scale-[.98] transition"
        >
          <UserPlus size={16} />
          Create Account
        </button>
         
        {msg && <p className="sp-msg text-red-600 mt-3 text-center text-sm">{msg}</p>}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="sp-focus text-[#0B1F3A] font-medium hover:underline rounded"
          >
            Login
          </a>
        </p>
      </div>

      <style>{pageStyles}</style>
    </div>
  );
}

export default Register;