
import React from "react";
import HeroImage from "../assets/img/Hero.jfif";
import { useNavigate } from "react-router-dom";
function Hero() {

  let navigate = useNavigate()
  return (
    <div className="relative h-150">

      <img
        src={HeroImage}
        alt="Solar Energy"
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      <div className="absolute top-10 left-10 text-white w-150">

       

        <h1 className="text-5xl font-bold mb-6 mt-13">
          Know Your Home's Energy
          <br />
          Choose the Right Solar System
        </h1>

        <p className="text-lg mb-8">
          Calculate your home's exact electricity consumption based on your
          appliances and get an instant, estimated solar system recommendation
          with battery backup options.
        </p>

        <div className="flex mb-10">
          <button 
          onClick={function(){
            navigate("/Calculate/all")
          }}
          className="bg-white text-black px-5 py-3 mr-4 rounded cursor-pointer">
            Calculate My Solar Needs
          </button>

          <button className="border border-white px-5 py-3 rounded cursor-pointer">
            Explore Solar Products
          </button>
        </div>

        <div className="flex">
          <div className="mr-10">
            <p className="font-bold">Interactive Estimator</p>
            <p className="text-sm">Preset Load</p>
          </div>

          <div className="mr-10">
            <p className="font-bold">Appliance Library</p>
            <p className="text-sm">Marketplace</p>
          </div>

          <div>
            <p className="font-bold">Verified Vendors</p>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Hero;

