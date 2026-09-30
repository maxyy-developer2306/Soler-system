import React, { useState } from "react";

function Calculate() {
  const [buttonclick, setButtonclick] = useState(0);
  const [unitTwo, setUnitTwo] = useState(0);
  const [unitThree, setUnitThree] = useState(0);
  const [unitFive, setUnitFive] = useState(0);
  const [unitSix, setUnitSix] = useState(0);
  const [unitSeven, setUnitSeven] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);

  const [dailyUsage, setDailyUsage] = useState(0);
  const [solarSystem, setSolarSystem] = useState(0);
  const [solarPanels, setSolarPanels] = useState(0);

  const [appliance, setAppliance] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [ledBulb, setLedBulb] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [tubelight, setTubelight] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [fan, setFan] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [spotlight, setSpotlight] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [ledSpotlight, setLedSpotlight] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  function calculateUnit() {
    let result =
      (24 * appliance.quantity * appliance.days * appliance.hours) / 1000;

    let resultTwo =
      (10 * ledBulb.quantity * ledBulb.days * ledBulb.hours) / 1000;

    let resultThree =
      (50 * tubelight.quantity * tubelight.days * tubelight.hours) / 1000;

    let resultFive =
      (80 * fan.quantity * fan.days * fan.hours) / 1000;

    let resultSix =
      (50 * spotlight.quantity * spotlight.days * spotlight.hours) / 1000;

    let resultSeven =
      (5 * ledSpotlight.quantity * ledSpotlight.days * ledSpotlight.hours) /
      1000;

    let total =
      result +
      resultTwo +
      resultThree +
      resultFive +
      resultSix +
      resultSeven;

    let daily = total / 30;

    let solar = daily / 5;

    let solarWithLoss = solar / 0.80;

    let panels = Math.ceil(solarWithLoss / 0.55);

    setButtonclick(result);
    setUnitTwo(resultTwo);
    setUnitThree(resultThree);
    setUnitFive(resultFive);
    setUnitSix(resultSix);
    setUnitSeven(resultSeven);
    setTotalUnit(total);

    setDailyUsage(daily);
    setSolarSystem(solarWithLoss);
    setSolarPanels(panels);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setAppliance({
      ...appliance,
      [name]: value,
    });
  }

  function handleLedChange(e) {
    const { name, value } = e.target;

    setLedBulb({
      ...ledBulb,
      [name]: value,
    });
  }

  function handleTubeChange(e) {
    const { name, value } = e.target;

    setTubelight({
      ...tubelight,
      [name]: value,
    });
  }

  function handleFanChange(e) {
    const { name, value } = e.target;

    setFan({
      ...fan,
      [name]: value,
    });
  }

  function handleSpotlightChange(e) {
    const { name, value } = e.target;

    setSpotlight({
      ...spotlight,
      [name]: value,
    });
  }

  function handleLedSpotlightChange(e) {
    const { name, value } = e.target;

    setLedSpotlight({
      ...ledSpotlight,
      [name]: value,
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800 ">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
        Electricity Load & Bill Calculator
      </h1>

      <p className="text-center text-slate-500 text-sm mb-8">
        Enter your household appliances quantity and daily operational hours to
        estimate electricity usage.
      </p>

      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="bg-slate-900 text-white p-3 font-bold">
          Lights
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
            <p className="w-40">Energy Saver Lights</p>
            <p className="w-20">24W</p>

            <input
              type="number"
              name="quantity"
              value={appliance.quantity}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={appliance.days}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={appliance.hours}
              onChange={handleChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{buttonclick}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">LED Bulb</p>
            <p className="w-20">10W</p>

            <input
              type="number"
              name="quantity"
              value={ledBulb.quantity}
              onChange={handleLedChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={ledBulb.days}
              onChange={handleLedChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={ledBulb.hours}
              onChange={handleLedChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitTwo}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Tubelight</p>
            <p className="w-20">50W</p>

            <input
              type="number"
              name="quantity"
              value={tubelight.quantity}
              onChange={handleTubeChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={tubelight.days}
              onChange={handleTubeChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={tubelight.hours}
              onChange={handleTubeChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitThree}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Fan</p>
            <p className="w-20">80W</p>

            <input
              type="number"
              name="quantity"
              value={fan.quantity}
              onChange={handleFanChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={fan.days}
              onChange={handleFanChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={fan.hours}
              onChange={handleFanChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitFive}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Spotlight</p>
            <p className="w-20">50W</p>

            <input
              type="number"
              name="quantity"
              value={spotlight.quantity}
              onChange={handleSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={spotlight.days}
              onChange={handleSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={spotlight.hours}
              onChange={handleSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitSix}</p>
          </div>

          <div className="flex items-center py-3 text-sm">
            <p className="w-40">LED Spotlight</p>
            <p className="w-20">5W</p>

            <input
              type="number"
              name="quantity"
              value={ledSpotlight.quantity}
              onChange={handleLedSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="days"
              value={ledSpotlight.days}
              onChange={handleLedSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              name="hours"
              value={ledSpotlight.hours}
              onChange={handleLedSpotlightChange}
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{unitSeven}</p>
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
          <p className="text-sm text-slate-500">
            Daily Usage
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {dailyUsage} kWh/day
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Total daily electricity consumption
          </p>
        </div>

        <div className="border rounded-lg p-5 mr-4 w-90">
          <p className="text-sm text-slate-500">
            Monthly Estimated
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {totalUnit} kWh/mo
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Based on 30 calendar days
          </p>
        </div>

        <div className="border rounded-lg p-5 w-90">
          <p className="text-sm text-slate-500">
            Recommended Solar
          </p>

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

export default Calculate;