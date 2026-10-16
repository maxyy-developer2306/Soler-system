
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ApplianceSidebar from "./components/ApplianceSidebar";
import Sidbar from "./components/Sidbar";
import ScrollToTop from "./components/ScrollToTop";
import MiniChatbot from "./components/MiniChatbot";

import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Calculate from "./pages/Calculate";
import Products from "./pages/Products";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AllAppliances from "./pages/user/AllAppliances";
import AC from "./pages/user/AC";
import Refrigerator from "./pages/user/Refrigerator";
import Fan from "./pages/user/Fan";
import TV from "./pages/user/TV";
import Computer from "./pages/user/Computer";
import Iron from "./pages/user/Iron";
import Kitchen from "./pages/user/Kitchen";
import Microwave from "./pages/user/Microwave";
import WashingMachine from "./pages/user/WashingMachine";
import Products_managment from "./pages/user/Products_managment";
import CreateProduct from "./pages/user/CreateProduct";


import Dashboard from "./pages/user/Dashboard";
import History from "./pages/user/History";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import Myprodcuts from "./pages/user/Myprodcuts";
import EditProduct from "./pages/user/EditProduct";
import ProfileCreate from "./pages/user/Profile.create";
import ProfileEdit from "./pages/user/Profile.edit";
import Orders from "./pages/user/Orders";
import Admin from "./pages/admin/Admin";

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidbar />

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Hero" element={<Hero />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/HowItWorks" element={<HowItWorks />} />
        <Route path="/MiniChatbot" element={<MiniChatbot />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Products_managment" element={<Products_managment />} />

       
        <Route element={<DashboardLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Myprodcuts" element={<Myprodcuts />} />
          <Route path="/CreateProduct" element={<CreateProduct />} />
          <Route path="/ProfileCreate" element={<ProfileCreate />} />
          <Route path="/ProfileEdit" element={<ProfileEdit />} />
          <Route path="/Orders" element={<Orders />} />
         <Route path="/EditProduct/:id" element={<EditProduct />} />
         
          <Route path="/History" element={<History />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Settings" element={<Settings />} />
        </Route>


        <Route
          path="/Calculate/all"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <AllAppliances />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Calculate />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/ac"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <AC />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/refrigerator"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Refrigerator />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/fan"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Fan />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/tv"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <TV />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/computer"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Computer />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/iron"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Iron />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/kitchen"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Kitchen />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/microwave"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <Microwave />
              </div>
            </div>
          }
        />

        <Route
          path="/Calculate/washing-machine"
          element={
            <div className="flex">
              <ApplianceSidebar />
              <div className="flex-1">
                <WashingMachine />
              </div>
            </div>
          }
        />

        {/* Normal pages - Sidbar nahi hoga */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
