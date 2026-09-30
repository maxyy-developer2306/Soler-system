import React from "react";
import {
  Sun,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

function Footer() {
  return (
    <div className="border-t">

      <div className="p-10 flex justify-between">

        <div className="w-80">
          <div className="flex items-center mb-4">
            <Sun size={22} />
            <h2 className="font-bold text-lg ml-2">
              Solar System
            </h2>
          </div>

          <p className="text-sm text-gray-600">
            Understand your home's energy consumption and find the right
            solar system for your daily needs.
          </p>

          <button className="mt-5 bg-black text-white px-4 py-2 rounded text-sm cursor-pointer flex items-center">
            Calculate Your Needs
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>

          <p className="text-sm mb-3 cursor-pointer">Home</p>
          <p className="text-sm mb-3 cursor-pointer">How It Works</p>
          <p className="text-sm mb-3 cursor-pointer">Products</p>
          <p className="text-sm cursor-pointer">About</p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Services</h3>

          <p className="text-sm mb-3 cursor-pointer">Solar Calculator</p>
          <p className="text-sm mb-3 cursor-pointer">Appliance Library</p>
          <p className="text-sm mb-3 cursor-pointer">Battery Backup</p>
          <p className="text-sm cursor-pointer">Marketplace</p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Contact</h3>

          <div className="flex items-center mb-3">
            <Mail size={17} />
            <p className="text-sm ml-2">info@solarsystem.com</p>
          </div>

          <div className="flex items-center mb-3">
            <Phone size={17} />
            <p className="text-sm ml-2">+92 300 0000000</p>
          </div>

          <div className="flex items-center">
            <MapPin size={17} />
            <p className="text-sm ml-2">Bannu, Pakistan</p>
          </div>
        </div>

      </div>

      <div className="border-t p-5 flex items-center justify-between">

        <p className="text-sm text-gray-600">
          © 2026 Solar System. All rights reserved.
        </p>

        <div className="flex">
          <p className="text-sm mr-6 cursor-pointer">
            Privacy Policy
          </p>

          <p className="text-sm mr-6 cursor-pointer">
            Terms & Conditions
          </p>

          <p className="text-sm cursor-pointer">
            Support
          </p>
        </div>

      </div>

    </div>
  );
}

export default Footer;

