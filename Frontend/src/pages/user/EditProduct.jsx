
import React, { useEffect, useState } from 'react'
import { ImagePlus, Sun } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../../config/api'

function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [msg, setMsg] = useState("")
  const [image, setImage] = useState(null)

  const [product, setProduct] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
    company: '',
    category: '',
    quantity: ''
  })

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.get(
          API_BASE + "/user/check",
          { withCredentials: true }
        )

        if (!response.data.success) {
          navigate("/Login", { replace: true })
        }
      } catch (error) {
        navigate("/Login", { replace: true })
      }
    }

    checkLogin()
  }, [navigate])

  useEffect(() => {
    async function getProduct() {
      try {
        const response = await axios.get(
          API_BASE + "/api/products/" + id,
          { withCredentials: true }
        )

        if (response.data.success) {
          setProduct(response.data.product)
        }
      } catch (error) {
        console.log(error)
        setMsg(error.response?.data?.msg || "Product not found")
      }
    }

    getProduct()
  }, [id])

  async function EditProductApi() {
    try {
      const formData = new FormData()

      if (image) {
        formData.append("image", image)
      }

      formData.append("title", product.title)
      formData.append("description", product.description)
      formData.append("price", product.price)
      formData.append("company", product.company)
      formData.append("category", product.category)
      formData.append("quantity", product.quantity)

      const response = await axios.put(
        API_BASE + "/api/products/edit/" + id,
        formData,
        {
          withCredentials: true
        }
      )

      setMsg(response.data.msg)

      if (response.data.success === true) {
        navigate("/dashboard")
      }
    } catch (error) {
      console.log(error)
      setMsg(error.response?.data?.msg || "Product not updated")
    }
  }

  return (
    <div className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-5">
      <div className="mx-auto max-w-4xl bg-white border border-slate-200 rounded-xl p-5">

        <div className="flex items-center gap-3 mb-5">
          <div className="bg-yellow-400 p-2 rounded-md">
            <Sun size={22} color="#0B1F3A" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#0B1F3A]">
              Edit Product
            </h2>
            <p className="text-sm text-slate-500">
              Update your solar product details
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm text-slate-700">
              Product Image
            </label>

            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-32 h-32 object-cover rounded-md mt-2"
              />
            )}

            <label className="flex items-center gap-2 mt-2 p-3 border border-dashed border-slate-300 rounded-md cursor-pointer">
              <ImagePlus size={20} color="#1E4E8C" />

              <span className="text-sm text-slate-500">
                {image ? image.name : "Choose new image (optional)"}
              </span>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0] || null)}
                className="hidden"
              />
            </label>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="New product preview"
                className="w-32 h-32 object-cover rounded-md mt-2"
              />
            )}
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Product Title
            </label>
            <input
              type="text"
              value={product.title || ""}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">
              Description
            </label>
            <textarea
              value={product.description || ""}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              rows="2"
              className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <label className="text-sm text-slate-700">
                Price (Rs)
              </label>
              <input
                type="number"
                value={product.price ?? ""}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
              />
            </div>

            <div className="w-full">
              <label className="text-sm text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                value={product.quantity ?? ""}
                onChange={(e) =>
                  setProduct({ ...product, quantity: e.target.value })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
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
                value={product.company || ""}
                onChange={(e) =>
                  setProduct({ ...product, company: e.target.value })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
              />
            </div>

            <div className="w-full">
              <label className="text-sm text-slate-700">
                Category
              </label>
              <select
                value={product.category || ""}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-md outline-none focus:border-[#1E4E8C]"
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
            onClick={EditProductApi}
            className="bg-[#0B1F3A] text-white p-2 rounded-md hover:bg-[#1E4E8C] cursor-pointer"
          >
            Save Changes
          </button>

          {msg && (
            <p className="text-sm text-center text-[#0B1F3A]">
              {msg}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

export default EditProduct
