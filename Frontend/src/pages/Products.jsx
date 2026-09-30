import React, { useState } from "react";
import {
  Search,
  User,
  ShoppingCart,
} from "lucide-react";

function Products() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="p-10 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              SOLAR MARKETPLACE
            </p>

            <h1 className="text-4xl font-bold mb-3">
              Solar Products
            </h1>

            <p className="text-sm text-gray-600">
              Find solar panels, batteries and inverters for your home.
            </p>
          </div>

          <button className="border p-2 rounded cursor-pointer">
            <User size={18} />
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex items-center border rounded w-80 bg-white">
            <Search size={16} className="ml-3 text-gray-500" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 w-full text-sm outline-none"
            />
          </div>

          <button className="border px-3 py-2 rounded ml-2 text-sm cursor-pointer">
            Search
          </button>
        </div>
      </div>

      <div className="p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-2">
              PRODUCTS
            </p>

            <h2 className="text-2xl font-bold">
              Solar Equipment
            </h2>
          </div>

          <div className="flex items-center">
            <ShoppingCart size={18} />

            <p className="ml-2 text-sm">
              Solar Marketplace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;