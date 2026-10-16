import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";
import { API_BASE } from "../../config/api";

function Myprodcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/api/products/my-products`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        setError(response.data.msg || "Products fetch nahi hue.");
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
    async function checkLogin() {
      try {
        const response = await axios.get(
          `${API_BASE}/user/check`,
          { withCredentials: true }
        );

        if (!response.data.success) {
          navigate("/Login", { replace: true });
        }
      } catch {
        navigate("/Login", { replace: true });
      }
    }

    checkLogin();
  }, [navigate]);

  useEffect(() => {
    getProducts();
  }, [getProducts, location.key]);

  async function deleteProduct() {
    if (!selectedProduct) return;

    const id = selectedProduct._id;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await axios.delete(
        `${API_BASE}/api/products/delete/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProducts((previousProducts) =>
          previousProducts.filter((item) => item._id !== id)
        );

        setMessage("Product successfully delete ho gaya.");
        setSelectedProduct(null);
      } else {
        setError(response.data.msg || "Product delete nahi hua.");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Product delete nahi ho saka."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#EAF2F8] p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#0B1F3A]">
              My Products
            </h1>
            <p className="mt-1 text-sm font-light text-slate-600">
              Manage your solar products and stock.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={getProducts}
              disabled={loading}
              className="flex items-center cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-[#0B1F3A] hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={15} className="mr-2" />
              Refresh
            </button>

            <button
              onClick={() => navigate("/CreateProduct")}
              className="flex cursor-pointer items-center rounded-md bg-[#0B1F3A] px-4 py-2 text-sm text-white hover:bg-[#12305a]"
            >
              <Plus size={16} className="mr-2 text-[#FFC233]" />
              Create Product
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Package
              size={40}
              className="mx-auto mb-3 text-[#1E4E8C]"
            />
            <h2 className="text-xl font-light text-[#0B1F3A]">
              No Products Yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first solar product to get started.
            </p>
            <button
              onClick={() => navigate("/CreateProduct")}
              className="mt-5 rounded-md bg-[#FFC233] px-5 py-2 text-sm text-[#0B1F3A] hover:bg-[#ffd25e]"
            >
              Create Product
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((eachData) => (
              <div
                key={eachData._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-[#FFC233]"
              >
                <img
                  src={eachData.image}
                  alt={eachData.title}
                  className="h-44 w-full bg-slate-100 object-cover"
                />

                <div className="p-4">
                  <span className="inline-block rounded-full bg-[#EAF2F8] px-3 py-1 text-xs text-[#1E4E8C]">
                    {eachData.category || "N/A"}
                  </span>

                  <h2 className="mt-3 line-clamp-1 text-lg text-[#0B1F3A]">
                    {eachData.title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {eachData.description}
                  </p>

                  <h3 className="mt-3 text-2xl text-[#0B1F3A]">
                    Rs. {eachData.price}
                  </h3>

                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company</span>
                      <span className="text-slate-700">
                        {eachData.company || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Stock</span>
                      <span
                        className={
                          Number(eachData.quantity || 0) === 0
                            ? "text-red-600"
                            : "text-slate-700"
                        }
                      >
                        {Number(eachData.quantity || 0) === 0
                          ? "Out of Stock"
                          : eachData.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/EditProduct/${eachData._id}`)
                      }
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-md bg-[#0B1F3A] py-2 text-xs text-white hover:bg-[#12305a]"
                    >
                      <Pencil
                        size={13}
                        className="mr-1.5 text-[#FFC233]"
                      />
                      Edit
                    </button>

                    <button
                      onClick={() => setSelectedProduct(eachData)}
                      disabled={deletingId === eachData._id}
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-red-200 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={13} className="mr-1.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div
          onClick={() => {
            if (!deletingId) setSelectedProduct(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <AlertTriangle size={24} />
                </div>

                <h2 className="text-xl font-semibold text-[#0B1F3A]">
                  Delete Product?
                </h2>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                disabled={!!deletingId}
                className="text-slate-500 cursor-pointer hover:text-red-500 disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#0B1F3A]">
                {selectedProduct.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                disabled={!!deletingId}
                className="flex-1 rounded-md cursor-pointer border border-slate-300 py-2.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={deleteProduct}
                disabled={!!deletingId}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-red-600 py-2.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={15} />
                {deletingId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myprodcuts;
