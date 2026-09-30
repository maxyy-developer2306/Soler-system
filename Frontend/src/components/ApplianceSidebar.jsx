import React, { useState } from "react";
import {
  Lightbulb,
  Snowflake,
  Refrigerator,
  Fan,
  Tv,
  Monitor,
  Flame,
  CookingPot,
  Microwave,
  WashingMachine,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

function ApplianceSidebar() {
  const [activePage, setActivePage] = useState("all");

  return (
    <div className="w-48 border-r pr-4 ml-3">

      <div className="mb-4 mt-10">
        <p className="text-xs text-gray-500">
          LOAD CALCULATOR
        </p>

        <h2 className="font-bold mt-3">
          Appliances
        </h2>
      </div>

      <Link
        to="/Calculate/all"
        onClick={() => setActivePage("all")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "all"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Home size={17} />
        <span className="ml-2">All Appliances</span>
      </Link>

      <Link
        to="/Calculate"
        onClick={() => setActivePage("lights")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "lights"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Lightbulb size={17} />
        <span className="ml-2">Lights</span>
      </Link>

      <Link
        to="/Calculate/ac"
        onClick={() => setActivePage("ac")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "ac"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Snowflake size={17} />
        <span className="ml-2">Air Conditioner</span>
      </Link>

      <Link
        to="/Calculate/refrigerator"
        onClick={() => setActivePage("refrigerator")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "refrigerator"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Refrigerator size={17} />
        <span className="ml-2">Refrigerator</span>
      </Link>

      <Link
        to="/Calculate/fan"
        onClick={() => setActivePage("fan")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "fan"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Fan size={17} />
        <span className="ml-2">Fans</span>
      </Link>

      <Link
        to="/Calculate/tv"
        onClick={() => setActivePage("tv")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "tv"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Tv size={17} />
        <span className="ml-2">Television</span>
      </Link>

      <Link
        to="/Calculate/computer"
        onClick={() => setActivePage("computer")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "computer"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Monitor size={17} />
        <span className="ml-2">Computer</span>
      </Link>

      <Link
        to="/Calculate/iron"
        onClick={() => setActivePage("iron")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "iron"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Flame size={17} />
        <span className="ml-2">Iron</span>
      </Link>

      <Link
        to="/Calculate/kitchen"
        onClick={() => setActivePage("kitchen")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "kitchen"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <CookingPot size={17} />
        <span className="ml-2">Kitchen</span>
      </Link>

      <Link
        to="/Calculate/microwave"
        onClick={() => setActivePage("microwave")}
        className={`flex items-center px-2 py-2 rounded mb-1 text-sm ${
          activePage === "microwave"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <Microwave size={17} />
        <span className="ml-2">Microwave</span>
      </Link>

      <Link
        to="/Calculate/washing-machine"
        onClick={() => setActivePage("washing-machine")}
        className={`flex items-center px-2 py-2 rounded text-sm ${
          activePage === "washing-machine"
            ? "bg-gray-100 border-b-2 border-black"
            : "hover:bg-gray-100"
        }`}
      >
        <WashingMachine size={17} />
        <span className="ml-2">Washing Machine</span>
      </Link>

    </div>
  );
}

export default ApplianceSidebar;
