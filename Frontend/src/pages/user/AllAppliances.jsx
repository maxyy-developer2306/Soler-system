import React, { useState } from "react";

function AllAppliances() {
  const [totalUnits, setTotalUnits] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [connectedLoad, setConnectedLoad] = useState(0);
  const [solarSystem, setSolarSystem] = useState(0);
  const [solarPanels, setSolarPanels] = useState(0);

  const [lights, setLights] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [ac, setAc] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [refrigerator, setRefrigerator] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [fan, setFan] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [tv, setTv] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [computer, setComputer] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [iron, setIron] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [kitchen, setKitchen] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [microwave, setMicrowave] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  const [washingMachine, setWashingMachine] = useState({
    quantity: "",
    days: "",
    hours: "",
  });

  function calculateUnits() {
    let lightUnits = (24 * lights.quantity * lights.days * lights.hours) / 1000;

    let acUnits = (1500 * ac.quantity * ac.days * ac.hours) / 1000;

    let refrigeratorUnits =
      (150 * refrigerator.quantity * refrigerator.days * refrigerator.hours) /
      1000;

    let fanUnits = (80 * fan.quantity * fan.days * fan.hours) / 1000;

    let tvUnits = (120 * tv.quantity * tv.days * tv.hours) / 1000;

    let computerUnits =
      (200 * computer.quantity * computer.days * computer.hours) / 1000;

    let ironUnits = (1000 * iron.quantity * iron.days * iron.hours) / 1000;

    let kitchenUnits =
      (1000 * kitchen.quantity * kitchen.days * kitchen.hours) / 1000;

    let microwaveUnits =
      (1200 * microwave.quantity * microwave.days * microwave.hours) / 1000;

    let washingMachineUnits =
      (500 *
        washingMachine.quantity *
        washingMachine.days *
        washingMachine.hours) /
      1000;

    let total =
      lightUnits +
      acUnits +
      refrigeratorUnits +
      fanUnits +
      tvUnits +
      computerUnits +
      ironUnits +
      kitchenUnits +
      microwaveUnits +
      washingMachineUnits;

    let daily = total / 30;

    let load =
      24 * lights.quantity +
      1500 * ac.quantity +
      150 * refrigerator.quantity +
      80 * fan.quantity +
      120 * tv.quantity +
      200 * computer.quantity +
      1000 * iron.quantity +
      1000 * kitchen.quantity +
      1200 * microwave.quantity +
      500 * washingMachine.quantity;

    let solar = daily / 5;

    let solarWithLoss = solar / 0.8;

    let panels = Math.ceil(solarWithLoss / 0.55);

    setTotalUnits(total);
    setDailyUsage(daily);
    setConnectedLoad(load);
    setSolarSystem(solarWithLoss);
    setSolarPanels(panels);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 text-slate-800">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
        All Appliances Calculator
      </h1>

      <p className="text-center text-slate-500 text-sm mb-8">
        Calculate the total electricity consumption of all your household
        appliances in one place.
      </p>

      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="bg-slate-900 text-white p-3 font-bold">
          Household Appliances
        </div>

        <div className="p-4">
          <div className="flex items-center border-b pb-3 font-bold text-sm">
            <p className="w-40">Appliance</p>
            <p className="w-20">Watts</p>
            <p className="w-24">Quantity</p>
            <p className="w-20">Days</p>
            <p className="w-24">Hours/Day</p>
            <p className="w-24">Units</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Lights</p>
            <p className="w-20">24W</p>

            <input
              type="number"
              value={lights.quantity}
              onChange={(e) =>
                setLights({
                  ...lights,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={lights.days}
              onChange={(e) =>
                setLights({
                  ...lights,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={lights.hours}
              onChange={(e) =>
                setLights({
                  ...lights,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{(24 * lights.quantity * lights.days * lights.hours) / 1000}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Air Conditioner</p>
            <p className="w-20">1500W</p>

            <input
              type="number"
              value={ac.quantity}
              onChange={(e) =>
                setAc({
                  ...ac,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={ac.days}
              onChange={(e) =>
                setAc({
                  ...ac,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={ac.hours}
              onChange={(e) =>
                setAc({
                  ...ac,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{(1500 * ac.quantity * ac.days * ac.hours) / 1000}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Refrigerator</p>
            <p className="w-20">150W</p>

            <input
              type="number"
              value={refrigerator.quantity}
              onChange={(e) =>
                setRefrigerator({
                  ...refrigerator,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={refrigerator.days}
              onChange={(e) =>
                setRefrigerator({
                  ...refrigerator,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={refrigerator.hours}
              onChange={(e) =>
                setRefrigerator({
                  ...refrigerator,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>
              {(150 *
                refrigerator.quantity *
                refrigerator.days *
                refrigerator.hours) /
                1000}
            </p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Fan</p>
            <p className="w-20">80W</p>

            <input
              type="number"
              value={fan.quantity}
              onChange={(e) =>
                setFan({
                  ...fan,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={fan.days}
              onChange={(e) =>
                setFan({
                  ...fan,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={fan.hours}
              onChange={(e) =>
                setFan({
                  ...fan,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{(80 * fan.quantity * fan.days * fan.hours) / 1000}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Television</p>
            <p className="w-20">120W</p>

            <input
              type="number"
              value={tv.quantity}
              onChange={(e) =>
                setTv({
                  ...tv,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={tv.days}
              onChange={(e) =>
                setTv({
                  ...tv,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={tv.hours}
              onChange={(e) =>
                setTv({
                  ...tv,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{(120 * tv.quantity * tv.days * tv.hours) / 1000}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Computer</p>
            <p className="w-20">200W</p>

            <input
              type="number"
              value={computer.quantity}
              onChange={(e) =>
                setComputer({
                  ...computer,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={computer.days}
              onChange={(e) =>
                setComputer({
                  ...computer,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={computer.hours}
              onChange={(e) =>
                setComputer({
                  ...computer,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>
              {(200 * computer.quantity * computer.days * computer.hours) /
                1000}
            </p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Iron</p>
            <p className="w-20">1000W</p>

            <input
              type="number"
              value={iron.quantity}
              onChange={(e) =>
                setIron({
                  ...iron,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={iron.days}
              onChange={(e) =>
                setIron({
                  ...iron,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={iron.hours}
              onChange={(e) =>
                setIron({
                  ...iron,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>{(1000 * iron.quantity * iron.days * iron.hours) / 1000}</p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Kitchen Appliance</p>
            <p className="w-20">1000W</p>

            <input
              type="number"
              value={kitchen.quantity}
              onChange={(e) =>
                setKitchen({
                  ...kitchen,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={kitchen.days}
              onChange={(e) =>
                setKitchen({
                  ...kitchen,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={kitchen.hours}
              onChange={(e) =>
                setKitchen({
                  ...kitchen,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>
              {(1000 * kitchen.quantity * kitchen.days * kitchen.hours) / 1000}
            </p>
          </div>

          <div className="flex items-center border-b py-3 text-sm">
            <p className="w-40">Microwave</p>
            <p className="w-20">1200W</p>

            <input
              type="number"
              value={microwave.quantity}
              onChange={(e) =>
                setMicrowave({
                  ...microwave,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={microwave.days}
              onChange={(e) =>
                setMicrowave({
                  ...microwave,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={microwave.hours}
              onChange={(e) =>
                setMicrowave({
                  ...microwave,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>
              {(1200 * microwave.quantity * microwave.days * microwave.hours) /
                1000}
            </p>
          </div>

          <div className="flex items-center py-3 text-sm">
            <p className="w-40">Washing Machine</p>
            <p className="w-20">500W</p>

            <input
              type="number"
              value={washingMachine.quantity}
              onChange={(e) =>
                setWashingMachine({
                  ...washingMachine,
                  quantity: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={washingMachine.days}
              onChange={(e) =>
                setWashingMachine({
                  ...washingMachine,
                  days: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <input
              type="number"
              value={washingMachine.hours}
              onChange={(e) =>
                setWashingMachine({
                  ...washingMachine,
                  hours: e.target.value,
                })
              }
              className="w-16 border rounded p-1 mr-8"
            />

            <p>
              {(500 *
                washingMachine.quantity *
                washingMachine.days *
                washingMachine.hours) /
                1000}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={calculateUnits}
        className="bg-slate-900 text-white px-6 py-2 rounded mt-6 cursor-pointer hover:bg-slate-800"
      >
        Calculate
      </button>

      <div className="flex mt-6">
        <div className="border rounded-lg p-5 mr-4 w-56">
          <p className="text-sm text-slate-500">Daily Usage</p>

          <h2 className="text-2xl font-bold mt-2">
            {dailyUsage.toFixed(2)} kWh
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Total daily electricity consumption
          </p>
        </div>

        <div className="border rounded-lg p-5 mr-4 w-56">
          <p className="text-sm text-slate-500">Monthly Usage</p>

          <h2 className="text-2xl font-bold mt-2">
            {totalUnits.toFixed(2)} kWh
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Estimated usage for 30 days
          </p>
        </div>

        <div className="border rounded-lg p-5 mr-4 w-56">
          <p className="text-sm text-slate-500">Connected Load</p>

          <h2 className="text-2xl font-bold mt-2">{connectedLoad} W</h2>

          <p className="text-sm text-slate-500 mt-2">Total appliance load</p>
        </div>

        <div className="border rounded-lg p-5 w-64">
          <p className="text-sm text-slate-500">Recommended Solar</p>

          <h2 className="text-2xl font-bold mt-2">
            {solarSystem.toFixed(2)} kW
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Requires {solarPanels} Panels (550W)
          </p>
        </div>
      </div>
    </div>
  );
}

export default AllAppliances;
