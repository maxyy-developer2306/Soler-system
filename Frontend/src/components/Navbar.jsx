import React from "react";
import { Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {

  let location = useLocation()
  if(location.pathname=="/Calculate" ||
     location.pathname=="/Calculate/all" ||
     location.pathname=="/Calculate/refrigerator" ||
     location.pathname=="/Calculate/fan" ||
     location.pathname=="/Calculate/tv" ||
     location.pathname=="/Calculate/computer" ||
     location.pathname=="/Calculate/iron" ||
     location.pathname=="/Calculate/kitchen" ||
     location.pathname=="/Calculate/microwave" ||
     location.pathname=="/Calculate/washing-machine" ||
     location.pathname=="/Calculate/ac" 
    )
    
    return null

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Sun size={24} />
        <h2 className="ml-2 font-bold text-xl">Solar System</h2>
      </div>

      <div className="flex items-center">
        <Link to="/" className="mr-6 text-sm cursor-pointer">
          Home
        </Link>

        <Link to="/HowItWorks" className="mr-6 text-sm cursor-pointer">
          How It Works
        </Link>

        <Link to="/products" className="mr-6 text-sm cursor-pointer">
          Products
        </Link>

        <Link to="/about" className="mr-6 text-sm cursor-pointer">
          About
        </Link>

        <Link
          to="/login"
          className="mr-2 border px-3 py-1.5 rounded text-sm cursor-pointer"
        >
          Login
        </Link>

        <Link
          to="/Register"
          className="bg-black text-white px-3 py-1.5 rounded text-sm cursor-pointer"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
