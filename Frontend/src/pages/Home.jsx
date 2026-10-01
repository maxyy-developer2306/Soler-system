
import React from "react";
import {
  Calculator,
  Zap,
  BatteryCharging,
  Home as HomeIcon,
  ShieldCheck,
  Store,
  ArrowRight,
  Sun,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import MiniChatbot from "../components/MiniChatbot";

function Home() {
  return (
    <div>
      <Hero />
      <MiniChatbot />

      <div className="p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-3">SOLAR ENERGY ESTIMATOR</p>

            <h1 className="text-4xl font-bold mb-4">
              Understand Your Energy.
              <br />
              Plan Your Solar System.
            </h1>

            <p className="text-gray-600 w-150">
              Find out how much electricity your home uses and get a simple
              solar system estimate based on your daily appliance usage.
              Understand your energy needs before choosing solar equipment.
            </p>

            <button className="mt-6 bg-black text-white px-4 py-2 rounded cursor-pointer flex items-center">
              Start Calculation
              <ArrowRight size={17} className="ml-2" />
            </button>
          </div>

          <div className="border rounded p-6 w-100">
            <Calculator size={30} />

            <h2 className="font-bold text-xl mt-4 mb-2">
              Solar Calculator
            </h2>

            <p className="text-sm text-gray-600 mb-5">
              Add your appliances, quantity and daily usage hours to calculate
              your estimated electricity consumption.
            </p>

            <div className="flex items-center border rounded p-3 mb-3">
              <Zap size={20} />
              <p className="ml-3 text-sm">
                Daily Energy Consumption
              </p>
            </div>

            <div className="flex items-center border rounded p-3 mb-3">
              <BatteryCharging size={20} />
              <p className="ml-3 text-sm">
                Battery Backup Estimate
              </p>
            </div>

            <div className="flex items-center border rounded p-3">
              <Sun size={20} />
              <p className="ml-3 text-sm">
                Solar System Recommendation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 border-t">
        <div className="mb-8">
          <p className="text-sm mb-2">HOW IT WORKS</p>

          <h2 className="text-3xl font-bold mb-3">
            Solar planning made simple.
          </h2>

          <p className="text-gray-600 w-150">
            Our system helps you understand your electricity usage step by
            step. You only need to provide basic information about the
            appliances you use at home.
          </p>
        </div>

        <div className="flex">
          <div className="border rounded p-6 mr-5 w-1/3">
            <Calculator size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              01. Add Appliances
            </h3>

            <p className="text-sm text-gray-600">
              Select appliances such as fans, lights, TVs, refrigerators and
              other electrical devices from the appliance list.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/3">
            <Zap size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              02. Enter Usage
            </h3>

            <p className="text-sm text-gray-600">
              Enter the quantity of each appliance, number of days and how
              many hours it normally runs every day.
            </p>
          </div>

          <div className="border rounded p-6 w-1/3">
            <BatteryCharging size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              03. Get Your Result
            </h3>

            <p className="text-sm text-gray-600">
              Get your estimated electricity consumption and use the result to
              understand your solar and battery requirements.
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 border-t">
        <div className="flex items-center justify-between">
          <div className="w-150">
            <p className="text-sm mb-2">
              UNDERSTAND YOUR ELECTRICITY
            </p>

            <h2 className="text-3xl font-bold mb-4">
              Know where your energy is being used.
            </h2>

            <p className="text-gray-600 mb-4">
              Every electrical appliance contributes to your home's total
              electricity consumption. A fan, light, refrigerator, AC or
              television can have a different effect on your monthly usage.
            </p>

            <p className="text-gray-600">
              By entering the wattage, quantity and usage time of your
              appliances, the calculator can estimate how many electricity
              units your home may consume.
            </p>
          </div>

          <div className="border rounded p-6 w-100">
            <BarChart3 size={30} />

            <h3 className="font-bold text-xl mt-4 mb-3">
              Energy Usage
            </h3>

            <div className="border rounded p-3 mb-3">
              <p className="text-sm text-gray-500">
                Appliance Usage
              </p>
              <p className="font-bold mt-1">
                Watt × Quantity × Hours
              </p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm text-gray-500">
                Energy Consumption
              </p>
              <p className="font-bold mt-1">
                Energy in kWh / Units
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10">
        <div className="text-center mb-10">
          <p className="text-sm mb-2">
            SOLAR SYSTEM PLANNING
          </p>

          <h2 className="text-3xl font-bold mb-3">
            From electricity usage to solar planning.
          </h2>

          <p className="text-gray-600">
            Your electricity consumption gives you a starting point for
            understanding the solar system your home may require.
          </p>
        </div>

        <div className="flex">
          <div className="border rounded p-6 mr-5 w-1/3">
            <Sun size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              Solar Panel Estimate
            </h3>

            <p className="text-sm text-gray-600">
              Use your estimated energy consumption to understand the
              approximate solar panel capacity needed for your home.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/3">
            <BatteryCharging size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              Battery Backup
            </h3>

            <p className="text-sm text-gray-600">
              Understand your backup energy requirement for essential
              appliances when electricity is not available.
            </p>
          </div>

          <div className="border rounded p-6 w-1/3">
            <Zap size={25} />

            <h3 className="font-bold text-lg mt-4 mb-2">
              System Requirement
            </h3>

            <p className="text-sm text-gray-600">
              Get a simple overview of the solar capacity and backup system
              that can match your estimated household usage.
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 border-t">
        <div className="mb-8">
          <p className="text-sm mb-2">
            APPLIANCE LIBRARY
          </p>

          <h2 className="text-3xl font-bold mb-3">
            Common appliances are easy to add.
          </h2>

          <p className="text-gray-600 w-150">
            The system can organize common household appliances so users can
            quickly enter their usage information without complicated steps.
          </p>
        </div>

        <div className="flex">
          <div className="border rounded p-6 mr-5 w-1/4">
            <Lightbulb size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Lights
            </h3>

            <p className="text-sm text-gray-600">
              LED bulbs, tube lights and spotlights.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/4">
            <Zap size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Fans
            </h3>

            <p className="text-sm text-gray-600">
              Ceiling fans and other household fans.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/4">
            <HomeIcon size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Home Devices
            </h3>

            <p className="text-sm text-gray-600">
              TVs, refrigerators and other appliances.
            </p>
          </div>

          <div className="border rounded p-6 w-1/4">
            <Calculator size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Custom Usage
            </h3>

            <p className="text-sm text-gray-600">
              Add other electrical devices used in your home.
            </p>
          </div>
        </div>
      </div>

      <div className="p-10">
        <div className="flex items-center justify-between">
          <div className="w-150">
            <p className="text-sm mb-2">
              SOLAR MARKETPLACE
            </p>

            <h2 className="text-3xl font-bold mb-4">
              Explore solar products after calculating your needs.
            </h2>

            <p className="text-gray-600 mb-4">
              Once you understand your energy requirement, you can explore
              solar panels, batteries, inverters and other solar equipment
              through our marketplace.
            </p>

            <p className="text-gray-600">
              The marketplace is designed to make it easier to find products
              that match your solar planning requirements.
            </p>

            <button className="mt-6 border px-4 py-2 rounded cursor-pointer flex items-center">
              Explore Products
              <ArrowRight size={17} className="ml-2" />
            </button>
          </div>

          <div className="border rounded p-6 w-100">
            <Store size={30} />

            <h3 className="font-bold text-xl mt-4 mb-3">
              Solar Marketplace
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Browse solar equipment and discover products for your home
              energy setup.
            </p>

            <div className="border rounded p-3 mb-3">
              <p className="text-sm">
                Solar Panels
              </p>
            </div>

            <div className="border rounded p-3 mb-3">
              <p className="text-sm">
                Solar Batteries
              </p>
            </div>

            <div className="border rounded p-3">
              <p className="text-sm">
                Solar Inverters
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 border-t">
        <div className="text-center mb-8">
          <p className="text-sm mb-2">
            WHY USE OUR SYSTEM
          </p>

          <h2 className="text-3xl font-bold mb-3">
            Everything you need to understand your solar needs.
          </h2>

          <p className="text-gray-600">
            Simple tools and useful information for making your solar planning
            easier.
          </p>
        </div>

        <div className="flex">
          <div className="border rounded p-6 mr-5 w-1/4">
            <HomeIcon size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Home Energy
            </h3>

            <p className="text-sm text-gray-600">
              Understand your home's electricity consumption.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/4">
            <Zap size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Smart Calculation
            </h3>

            <p className="text-sm text-gray-600">
              Calculate your estimated daily and monthly energy requirement.
            </p>
          </div>

          <div className="border rounded p-6 mr-5 w-1/4">
            <ShieldCheck size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Clear Results
            </h3>

            <p className="text-sm text-gray-600">
              Get simple and understandable information about your energy
              requirements.
            </p>
          </div>

          <div className="border rounded p-6 w-1/4">
            <Store size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Solar Marketplace
            </h3>

            <p className="text-sm text-gray-600">
              Explore solar products and discover suitable equipment.
            </p>
          </div>
        </div>
      </div>

      <div className="p-10 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              Ready to know your solar needs?
            </h2>

            <p className="text-gray-600">
              Start with your appliances and get your estimated energy
              consumption and solar requirements.
            </p>
          </div>

          <button className="bg-black text-white px-5 py-2 rounded cursor-pointer flex items-center">
            Calculate My Solar Needs
            <ArrowRight size={17} className="ml-2" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;

