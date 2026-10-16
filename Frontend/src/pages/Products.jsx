import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, ArrowLeft, Package, X } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../config/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(
          API_BASE + "/api/products/products"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    (
      (product.title || "") +
      " " +
      (product.category || "") +
      " " +
      (product.company || "")
    )
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EAF2F8]">
      <div className="bg-[#0B1F3A] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Solar Products
              </h1>

              <p className="mt-2 text-sky-100">
                Explore solar panels, batteries and inverters.
              </p>
            </div>

            <button
              onClick={() => navigate("/Login")}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 cursor-pointer"
            >
              <User size={20} />
              Login
            </button>
          </div>

          <div className="mt-6 flex max-w-2xl items-center rounded-lg bg-white px-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="w-full p-3 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {loading ? (
          <p className="py-10 text-center text-slate-500">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <div className="py-10 text-center">
            <Package size={40} className="mx-auto text-slate-400" />
            <p className="mt-3 text-slate-600">No products found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  onClick={() => setSelectedProduct(product)}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <p className="text-sm text-slate-500">
                    {product.category}
                  </p>

                  <h2
                    onClick={() => setSelectedProduct(product)}
                    className="mt-2 text-lg font-bold text-[#0B1F3A]"
                  >
                    {product.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Company: {product.company}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-[#1E4E8C]">
                    Rs. {Number(product.price).toLocaleString("en-PK")}
                  </h3>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 w-full rounded-lg border border-[#0B1F3A] py-2 font-semibold text-[#0B1F3A] hover:bg-slate-100 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#0B1F3A]/70 p-4">
          <div className="relative my-auto w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-red-500 cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="grid gap-5 pt-6 sm:grid-cols-2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="h-64 w-full rounded-lg object-cover"
              />

              <div>
                <p className="text-sm text-slate-500">
                  {selectedProduct.category}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                  {selectedProduct.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {selectedProduct.description}
                </p>

                <h3 className="mt-4 text-2xl font-bold text-[#1E4E8C]">
                  Rs. {Number(selectedProduct.price).toLocaleString("en-PK")}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Company: {selectedProduct.company}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Stock: {selectedProduct.quantity}
                </p>

                <button
                  onClick={() => setShowPopup(true)}
                  disabled={Number(selectedProduct.quantity) < 1}
                  className="mt-5 w-full rounded-lg bg-[#FFC233] py-3 font-semibold text-[#0B1F3A] hover:bg-[#f5b414] cursor-pointer disabled:bg-slate-300"
                >
                  {Number(selectedProduct.quantity) < 1
                    ? "Out of Stock"
                    : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && selectedProduct && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Login or Register
              </h2>

              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-500 hover:text-red-500 cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-lg bg-[#EAF2F8] p-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="h-16 w-16 rounded-lg object-cover"
              />

              <div>
                <p className="font-semibold text-[#0B1F3A]">
                  {selectedProduct.title}
                </p>

                <p className="mt-1 font-bold text-[#1E4E8C]">
                  Rs. {Number(selectedProduct.price).toLocaleString("en-PK")}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Please login to your account or register a new account before
              buying this product.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-5 w-full rounded-lg bg-[#FFC233] py-3 font-semibold text-[#0B1F3A] hover:bg-[#f5b414] cursor-pointer"
            >
              Register Now
            </button>

            <button
              onClick={() => navigate("/Login")}
              className="mt-3 w-full rounded-lg border border-slate-300 py-3 font-semibold text-[#0B1F3A] hover:bg-slate-100 cursor-pointer"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
