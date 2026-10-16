
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
function Navbar() {

  let location = useLocation()

  if(location.pathname=="/Products_managment" ||
     location.pathname=="/Sidbar" ||
     location.pathname=="/dashboard" ||
     location.pathname=="/CreateProduct" ||
     location.pathname=="/history" ||
     location.pathname=="/settings" ||
     location.pathname=="/Myprodcuts" ||
     location.pathname=="/profile" ||
     location.pathname=="/Dashboard" ||
     location.pathname=="/Orders" ||
     location.pathname=="/Login" ||
     location.pathname=="/register" ||
     location.pathname.startsWith("/EditProduct/") 
   

    ) return null
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#0B1F3A] px-6 py-4 text-white shadow-md">

      <Link to="/" className="text-xl font-bold">
        Solar <span className="text-[#FFC233]">System</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-[#FFC233]">
          Home
        </Link>

        <Link to="/HowItWorks" className="hover:text-[#FFC233]">
          How It Works
        </Link>

        <Link to="/products" className="hover:text-[#FFC233]">
          Products
        </Link>

        <Link to="/about" className="hover:text-[#FFC233]">
          About
        </Link>
      </div>

      <div className="flex items-center gap-3">
     

        <Link
          to="/Login"
          className="rounded-lg bg-[#FFC233] px-4 py-2 font-semibold text-[#0B1F3A] hover:bg-[#FFD25E]"
        >
          Swith to saller
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
