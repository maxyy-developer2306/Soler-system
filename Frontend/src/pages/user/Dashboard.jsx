import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../../config/api";
import {
  Package,
  Boxes,
  Layers,
  Plus,
  ArrowRight,
  RefreshCw
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getMyProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_BASE}/api/products/my-products`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setProducts(res.data.products || []);
      } else {
        setError(res.data.msg || "Products not fetched");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Products load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMyProducts();
  }, [getMyProducts, location.key]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0
  );

  const categories = new Set(
    products.map((product) => product.category).filter(Boolean)
  ).size;

  const stats = [
    { title: "Total Products", value: totalProducts, icon: Package },
    { title: "Total Stock", value: totalStock, icon: Boxes },
    { title: "Categories", value: categories, icon: Layers }
  ];

  return (
    <div className="min-h-screen min-w-0 bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your solar products and stock.
          </p>
        </div>

        <button
          onClick={() => navigate("/CreateProduct")}
          className="flex items-center gap-2 cursor-pointer rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={getMyProducts}
            className="mt-3 flex items-center gap-2 rounded border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.title}</p>
                <Icon size={22} className="text-slate-700" />
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                {loading ? "..." : item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Your Products
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Products uploaded by you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={getMyProducts}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-black disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/Myprodcuts")}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-black"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={35} className="mx-auto text-slate-400" />
            <h3 className="mt-3 font-medium text-slate-800">
              No Products Yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Upload your first solar product to see it here.
            </p>
            <button
              onClick={() => navigate("/CreateProduct")}
              className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-slate-100"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-12 w-12 rounded border object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium text-slate-900">
                            {product.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.company || "No company"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.category || "N/A"}
                    </td>

                    <td className="p-4 text-slate-700">
                      Rs. {product.price}
                    </td>

                    <td className="p-4">
                      {Number(product.quantity || 0) === 0 ? (
                        <span className="text-red-600">Out of Stock</span>
                      ) : (
                        <span className="text-slate-700">
                          {product.quantity}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          navigate(`/EditProduct/${product._id}`)
                        }
                        className="rounded border border-slate-300 px-3 py-2 text-xs hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
