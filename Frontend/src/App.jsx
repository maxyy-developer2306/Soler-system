import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ApplianceSidebar from "./components/ApplianceSidebar";
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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Hero" element={<Hero />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/HowItWorks" element={<HowItWorks />} />

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
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/About" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
