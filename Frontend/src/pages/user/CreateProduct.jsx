
import React, { useState, useEffect } from "react";
import { ImagePlus, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/api";

function CreateProduct() {
  let navigate = useNavigate();

  let [msg, setMsg] = useState("");
  let [loading, setLoading] = useState(false);

  let [product, setProduct] = useState({
    image: "",
    title: "",
    description: "",
    price: "",
    company: "",
    category: "",
    quantity: "",
  });

  useEffect(() => {
    async function checkLogin() {
      try {
        let response = await axios.get(
          API_BASE + "/user/check",
          { withCredentials: true },
        );

        if (!response.data.success) {
          navigate("/Login", { replace: true });
        }
      } catch (error) {
        navigate("/Login", { replace: true });
      }
    }

    checkLogin();
  }, []);

  async function CreateProductApi() {
    setLoading(true);

    try {
      let formData = new FormData();

      formData.append("image", product.image);
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("company", product.company);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);

      let response = await axios.post(
        API_BASE + "/api/products/create",
        formData,
        {
          withCredentials: true,
        }
      );

      setMsg(response.data.msg);
      console.log(response.data);

      if (response.data.success === true) {
        navigate("/Myprodcuts");
      }
    } catch (error) {
      console.log(error);
      setMsg(error.response?.data?.msg || "Product not created");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 ml-64">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-md bg-yellow-400 p-2">
            <Sun size={22} color="#0B1F3A" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#0B1F3A]">
              Create Product
            </h2>
            <p className="text-sm text-slate-500">
              Add a new solar product
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-700">
              Product Image
            </label>

            <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 p-3">
              <ImagePlus size={20} color="#1E4E8C" />

              <span className="text-sm text-slate-500">
                {product.image
                  ? product.image.name
                  : "Choose product image"}
              </span>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={function (e) {
                  setProduct({
                    ...product,
                    image: e.target.files[0],
                  });
                }}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Product Title
            </label>

            <input
              type="text"
              value={product.title}
              onChange={function (e) {
                setProduct({
                  ...product,
                  title: e.target.value,
                });
              }}
              placeholder="Enter product title"
              className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Description
            </label>

            <textarea
              value={product.description}
              onChange={function (e) {
                setProduct({
                  ...product,
                  description: e.target.value,
                });
              }}
              placeholder="Enter description"
              rows="2"
              className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <label className="text-sm text-slate-700">
                Price (Rs)
              </label>

              <input
                type="number"
                value={product.price}
                onChange={function (e) {
                  setProduct({
                    ...product,
                    price: e.target.value,
                  });
                }}
                placeholder="Price"
                className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
              />
            </div>

            <div className="w-full">
              <label className="text-sm text-slate-700">
                Quantity
              </label>

              <input
                type="number"
                value={product.quantity}
                onChange={function (e) {
                  setProduct({
                    ...product,
                    quantity: e.target.value,
                  });
                }}
                placeholder="Quantity"
                className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <label className="text-sm text-slate-700">
                Company
              </label>

              <input
                type="text"
                value={product.company}
                onChange={function (e) {
                  setProduct({
                    ...product,
                    company: e.target.value,
                  });
                }}
                placeholder="Company name"
                className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
              />
            </div>

            <div className="w-full">
              <label className="text-sm text-slate-700">
                Category
              </label>

              <select
                value={product.category}
                onChange={function (e) {
                  setProduct({
                    ...product,
                    category: e.target.value,
                  });
                }}
                className="mt-1 w-full rounded-md border border-slate-300 p-2 outline-none focus:border-[#1E4E8C]"
              >
                <option value="">Select category</option>
                <option value="Solar Panel">Solar Panel</option>
                <option value="Battery">Battery</option>
                <option value="Inverter">Inverter</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button
            onClick={CreateProductApi}
            disabled={loading}
            className="cursor-pointer rounded-md bg-[#0B1F3A] p-2 text-white hover:bg-[#1E4E8C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          {msg && (
            <p className="text-center text-sm text-[#0B1F3A]">
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
