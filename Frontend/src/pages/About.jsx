import React from "react";
import {
  Sun,
  Calculator,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Users,
} from "lucide-react";

function About() {
  return (
    <div>

      <div className="p-10 bg-gray-50">

        <p className="text-sm text-gray-600 mb-3">
          ABOUT SOLAR SYSTEM
        </p>

        <h1 className="text-4xl font-bold mb-4">
          Making Solar Planning
          <br />
          Simple for Everyone.
        </h1>

        <p className="text-gray-600 w-150">
          Our platform helps homeowners understand their electricity usage
          and find a suitable solar system through simple calculations and
          clear recommendations.
        </p>

      </div>

      <div className="p-10">

        <div className="flex items-center justify-between">

          <div className="w-150">

            <div className="flex items-center mb-4">
              <Sun size={28} />

              <h2 className="text-2xl font-bold ml-3">
                Our Purpose
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Choosing a solar system can be confusing when you do not know
              how much electricity your home actually uses.
            </p>

            <p className="text-gray-600">
              We created this platform to make that process easier. Users can
              enter their appliances, quantity and daily usage hours to
              understand their estimated energy consumption.
            </p>

          </div>

          <div className="border rounded p-6 w-100 bg-green-50">

            <Calculator size={30} />

            <h3 className="font-bold text-xl mt-4 mb-3">
              Simple Solar Calculation
            </h3>

            <p className="text-sm text-gray-600">
              Enter your appliances and usage details to get an estimated
              electricity load and solar system recommendation.
            </p>

          </div>

        </div>

      </div>

      <div className="p-10 border-t bg-gray-50">

        <div className="text-center mb-10">

          <p className="text-sm text-gray-600 mb-2">
            WHAT WE PROVIDE
          </p>

          <h2 className="text-3xl font-bold">
            Tools designed for simple solar planning.
          </h2>

        </div>

        <div className="flex">

          <div className="border rounded p-6 mr-5 w-1/4 bg-white">

            <Zap size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Energy Calculator
            </h3>

            <p className="text-sm text-gray-600">
              Calculate your estimated daily electricity consumption.
            </p>

          </div>

          <div className="border rounded p-6 mr-5 w-1/4 bg-white">

            <BatteryCharging size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Battery Backup
            </h3>

            <p className="text-sm text-gray-600">
              Understand your estimated battery backup requirements.
            </p>

          </div>

          <div className="border rounded p-6 mr-5 w-1/4 bg-white">

            <ShieldCheck size={25} />

            <h3 className="font-bold mt-4 mb-2">
              Clear Results
            </h3>

            <p className="text-sm text-gray-600">
              Get simple results that are easy to understand.
            </p>

          </div>

          <div className="border rounded p-6 w-1/4 bg-white">

            <Users size={25} />

            <h3 className="font-bold mt-4 mb-2">
              For Homeowners
            </h3>

            <p className="text-sm text-gray-600">
              Designed to help homeowners make informed solar planning
              decisions.
            </p>

          </div>

        </div>

      </div>

      <div className="p-10">

        <div className="flex items-center justify-between">

          <div className="w-130">

            <p className="text-sm text-gray-600 mb-3">
              OUR VISION
            </p>

            <h2 className="text-3xl font-bold mb-4">
              A smarter way to understand your home's energy.
            </h2>

            <p className="text-gray-600">
              We want solar planning to be understandable for everyone.
              Instead of guessing your requirements, use your actual appliance
              usage to create a clear starting point for your solar journey.
            </p>

          </div>

          <div className="border rounded p-8 w-100">

            <Sun size={35} />

            <h3 className="font-bold text-xl mt-4 mb-3">
              Solar Made Simple
            </h3>

            <p className="text-sm text-gray-600">
              Calculate. Understand. Plan.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;

