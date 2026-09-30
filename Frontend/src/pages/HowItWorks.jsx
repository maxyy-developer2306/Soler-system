import React from "react";
import {
  Calculator,
  ListChecks,
  Clock3,
  Zap,
  BatteryCharging,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

function HowItWorks() {
  return (
    <div>

      <div className="p-10 bg-gray-50">

        <p className="text-sm text-gray-500 mb-3">
          HOW IT WORKS
        </p>

        <h1 className="text-4xl font-bold mb-4">
          Calculate Your Solar Needs
          <br />
          in Simple Steps.
        </h1>

        <p className="text-gray-600 w-150">
          Enter your home appliances and their daily usage. Our calculator
          will estimate your electricity consumption and suggest a suitable
          solar system.
        </p>

      </div>

      <div className="p-10">

        <div className="text-center mb-10">

          <p className="text-sm text-gray-500 mb-2">
            SIMPLE PROCESS
          </p>

          <h2 className="text-3xl font-bold mb-3">
            From appliances to solar recommendation.
          </h2>

          <p className="text-gray-600">
            Follow these simple steps to understand your home's energy needs.
          </p>

        </div>

        <div className="flex">

          <div className="border rounded p-6 mr-5 w-1/3">

            <div className="border rounded p-3 w-12">
              <ListChecks size={25} />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              STEP 01
            </p>

            <h3 className="font-bold text-xl mt-2 mb-3">
              Select Appliances
            </h3>

            <p className="text-sm text-gray-600">
              Choose the appliances you use at home, such as fans, lights,
              refrigerator, TV and other electrical devices.
            </p>

          </div>

          <div className="border rounded p-6 mr-5 w-1/3">

            <div className="border rounded p-3 w-12">
              <Clock3 size={25} />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              STEP 02
            </p>

            <h3 className="font-bold text-xl mt-2 mb-3">
              Enter Daily Usage
            </h3>

            <p className="text-sm text-gray-600">
              Enter how many appliances you have and how many hours each
              appliance is used every day.
            </p>

          </div>

          <div className="border rounded p-6 w-1/3">

            <div className="border rounded p-3 w-12">
              <Calculator size={25} />
            </div>

            <p className="text-sm text-gray-500 mt-5">
              STEP 03
            </p>

            <h3 className="font-bold text-xl mt-2 mb-3">
              Calculate Your Load
            </h3>

            <p className="text-sm text-gray-600">
              The system calculates your estimated daily electricity
              consumption based on the information you provide.
            </p>

          </div>

        </div>

      </div>

      <div className="p-10 border-t bg-gray-50">

        <div className="flex items-center justify-between">

          <div className="w-130">

            <p className="text-sm text-gray-500 mb-3">
              YOUR RESULT
            </p>

            <h2 className="text-3xl font-bold mb-4">
              Get a clear solar system estimate.
            </h2>

            <p className="text-gray-600 mb-5">
              After calculating your electricity load, the system gives you
              useful information about the solar panels, required capacity
              and battery backup.
            </p>

            <div className="flex items-center mb-3">
              <CheckCircle size={20} />
              <p className="ml-3 text-sm">
                Estimated daily energy consumption
              </p>
            </div>

            <div className="flex items-center mb-3">
              <CheckCircle size={20} />
              <p className="ml-3 text-sm">
                Recommended solar system capacity
              </p>
            </div>

            <div className="flex items-center">
              <CheckCircle size={20} />
              <p className="ml-3 text-sm">
                Estimated battery backup
              </p>
            </div>

          </div>

          <div className="border rounded p-8 w-100 bg-white">

            <Zap size={30} />

            <h3 className="font-bold text-xl mt-4 mb-3">
              Energy Calculation
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Your appliance usage is converted into an estimated daily
              electricity requirement.
            </p>

            <div className="border rounded p-4 mb-3 flex items-center">
              <Calculator size={20} />
              <p className="ml-3 text-sm">
                Appliance Load
              </p>
            </div>

            <div className="border rounded p-4 flex items-center">
              <BatteryCharging size={20} />
              <p className="ml-3 text-sm">
                Battery Backup
              </p>
            </div>

          </div>

        </div>

      </div>

      <div className="p-10">

        <div className="border rounded p-10 bg-gray-50 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold mb-3">
              Ready to calculate your solar needs?
            </h2>

            <p className="text-gray-600">
              Start adding your appliances and find your estimated solar
              requirement.
            </p>

          </div>

          <button className="bg-black text-white px-5 py-2 rounded cursor-pointer flex items-center">
            Start Calculation
            <ArrowRight size={17} className="ml-2" />
          </button>

        </div>

      </div>

    </div>
  );
}

export default HowItWorks;

