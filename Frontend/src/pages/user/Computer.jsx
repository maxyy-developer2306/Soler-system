
import React, { useState } from "react";

function Computer() {
  const [unitOne, setUnitOne] = useState(0);
  const [unitTwo, setUnitTwo] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [solarSystem, setSolarSystem] = useState(0);
  const [solarPanels, setSolarPanels] = useState(0);

  const [desktop, setDesktop] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [laptop, setLaptop] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  function calculateUnit() {
    let result =
      (300 * desktop.quantity * desktop.days * desktop.hours) / 1000;

    let resultTwo =
      (65 * laptop.quantity * laptop.days * laptop.hours) / 1000;

    let total = result + resultTwo;

    let daily = total / 30;
    let solar = daily / 5;
    let solarWithLoss = solar / 0.80;
    let panels = Math.ceil(solarWithLoss / 0.55);

    setUnitOne(result);
    setUnitTwo(resultTwo);
    setTotalUnit(total);
    setDailyUsage(daily);
    setSolarSystem(solarWithLoss);
    setSolarPanels(panels);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setDesktop({
      ...desktop,
      [name]: value,
    });
  }

  function handleLaptopChange(e) {
    const { name, value } = e.target;

    setLaptop({
      ...laptop,
      [name]: value,
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800">

      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
        Computer Calculator
      </h1>

      <p className="text-center text-slate-500 text-sm mb-8">
        Enter your computer usage to estimate electricity consumption.
      </p>

      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">

        <div className="bg-slate-900 text-white p-3 font-bold">
          Computer
        </div>

        <div className="p-4">

          <div className="flex items-center border-b pb-3 font-bold text-sm">
            <p className="w-40">Appliances</p>
            <p className="w-20">Watts</p>
            <p className="w-24">Quantity</p>
            <p className="w-20">Days</p>
            <p className="w-24">Hours/Day</p>
            <p className="w-24">Units</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">

            <p className="w-40">Desktop PC</p>
            <p className="w-20">300W</p>

            <input
              type="number"
              name="quantity"
              value={desktop.quantity}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={desktop.days}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={desktop.hours}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitOne}</p>

          </div>

          <div className="flex items-center py-3 text-sm">

            <p className="w-40">Laptop</p>
            <p className="w-20">65W</p>

            <input
              type="number"
              name="quantity"
              value={laptop.quantity}
              onChange={handleLaptopChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={laptop.days}
              onChange={handleLaptopChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={laptop.hours}
              onChange={handleLaptopChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitTwo}</p>

          </div>

        </div>
      </div>

      <button
        onClick={calculateUnit}
        className="bg-slate-900 text-white px-6 py-2 rounded mt-6 cursor-pointer hover:bg-slate-800"
      >
        Calculate
      </button>

      <div className="flex mt-6">

        <div className="border rounded-lg p-5 mr-4 w-90">
          <p className="text-sm text-slate-500">Daily Usage</p>
          <h2 className="text-2xl font-bold mt-2">
            {dailyUsage} kWh/day
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Total daily electricity consumption
          </p>
        </div>

        <div className="border rounded-lg p-5 mr-4 w-90">
          <p className="text-sm text-slate-500">Monthly Estimated</p>
          <h2 className="text-2xl font-bold mt-2">
            {totalUnit} kWh/mo
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Based on 30 calendar days
          </p>
        </div>

        <div className="border rounded-lg p-5 w-90">
          <p className="text-sm text-slate-500">Recommended Solar</p>
          <h2 className="text-2xl font-bold mt-2">
            {solarSystem} kW System
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Requires {solarPanels} Panels (550W)
          </p>
        </div>

      </div>

    </div>
  );
}

export default Computer;

