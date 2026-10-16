
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
     location.pathname=="/Admin" ||
     location.pathname.startsWith("/EditProduct/") 
   

    ) return null
  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-[#0B1F3A] px-4 py-3 text-white shadow-md sm:px-6 md:flex-nowrap md:py-4">

      <Link to="/" className="shrink-0 text-xl font-bold">
        Solar <span className="text-[#FFC233]">System</span>
      </Link>

      <div className="order-3 flex w-full items-center gap-5 overflow-x-auto whitespace-nowrap text-sm md:order-none md:w-auto md:gap-6">
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
          className="whitespace-nowrap rounded-lg bg-[#FFC233] px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#FFD25E] sm:px-4"
        >
          Swith to saller
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;
