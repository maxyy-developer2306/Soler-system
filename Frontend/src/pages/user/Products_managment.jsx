
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  X,
  Minus,
  Plus,
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../config/api";

const API = API_BASE;

const styles = `
@keyframes pm-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pm-pop {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes pm-progress {
  from { width: 100%; }
  to { width: 0%; }
}

.pm-fade {
  animation: pm-fade 0.25s ease-out;
}

.pm-pop {
  animation: pm-pop 0.3s ease-out;
}

.pm-progress-bar {
  animation: pm-progress 5s linear forwards;
}

.pm-cells {
  background-color: #0B1F3A;
  background-image:
    linear-gradient(rgba(120,170,230,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,170,230,0.14) 1px, transparent 1px);
  background-size: 40px 40px;
}

@media (prefers-reduced-motion: reduce) {
  .pm-fade, .pm-pop, .pm-progress-bar {
    animation: none;
  }
}
`;

function Products_managment() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.get(
          `${API}/user/check`,
          { withCredentials: true }
        );

        if (!response.data.success) {
          navigate("/Login", { replace: true });
        }
      } catch (error) {
        navigate("/Login", { replace: true });
      }
    }

    checkLogin();
  }, [navigate]);

  async function getProducts() {
    try {
      const response = await axios.get(
        `${API}/api/products/products`
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.log("Products Error:", error);
      setMessageType("error");
      setMessage(
        error.response?.data?.msg || "Products load nahi huay."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  async function PlaceOrder(e) {
    e.preventDefault();

    if (!selectedProduct || orderLoading) {
      return;
    }

    const stock = Number(selectedProduct.quantity);
    const orderQuantity = Number(quantity);

    if (
      !Number.isInteger(orderQuantity) ||
      orderQuantity < 1 ||
      orderQuantity > stock
    ) {
      setMessageType("error");
      setMessage("Please valid quantity select karo.");
      return;
    }

    try {
      setOrderLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API}/api/orders/create`,
        {
          productId: selectedProduct._id,
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          quantity: orderQuantity
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product._id === selectedProduct._id
              ? {
                  ...product,
                  quantity: Number(product.quantity) - orderQuantity
                }
              : product
          )
        );

        setSelectedProduct(null);
        setName("");
        setPhone("");
        setAddress("");
        setQuantity(1);

        setMessageType("success");
        setMessage("Your order has been placed successfully!");
      } else {
        setMessageType("error");
        setMessage(response.data.msg || "Order place nahi hua.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(
        error.response?.data?.msg || "Order place nahi hua. Dobara try karo."
      );

      console.log("Place Order Error:", error);
    } finally {
      setOrderLoading(false);
    }
  }

  function openOrder(product) {
    setSelectedProduct(product);
    setQuantity(1);
    setName("");
    setPhone("");
    setAddress("");
    setMessage("");
  }

  function closeOrder() {
    if (!orderLoading) {
      setSelectedProduct(null);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setKeyword(searchText.trim());
  }

  function clearSearch() {
    setSearchText("");
    setKeyword("");
    setActiveCategory("All");
  }

  function increaseQuantity() {
    if (Number(quantity) < Number(selectedProduct.quantity)) {
      setQuantity(Number(quantity) + 1);
    }
  }

  function decreaseQuantity() {
    if (Number(quantity) > 1) {
      setQuantity(Number(quantity) - 1);
    }
  }

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  ];

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const productText = [
      product.title,
      product.category,
      product.company,
      product.description
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory &&
      productText.includes(keyword.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#EAF2F8]">
      <style>{styles}</style>

      {message && (
        <div className="fixed top-5 right-5 z-[100] w-[calc(100%-40px)] max-w-sm pm-pop">
          <div
            className={`relative overflow-hidden flex items-start gap-3 rounded-xl border bg-white p-4 pb-5 shadow-xl ${
              messageType === "success"
                ? "border-blue-200"
                : "border-red-200"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle
                size={24}
                className="shrink-0 text-blue-700"
              />
            ) : (
              <AlertCircle
                size={24}
                className="shrink-0 text-red-600"
              />
            )}

            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                {messageType === "success" ? "Success" : "Error"}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="cursor-pointer text-slate-400 hover:text-slate-800"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
              <div
                key={message}
                className={`pm-progress-bar h-full ${
                  messageType === "success"
                    ? "bg-blue-600"
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pm-cells">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Solar Products
              </h2>

              <p className="mt-2 max-w-xl text-sky-100">
                Browse solar panels, batteries and inverters from vendors.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex cursor-pointer items-center rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              <User size={20} />
              <span className="ml-2">Profile</span>
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex max-w-2xl"
          >
            <div className="flex flex-1 items-center rounded-l-lg bg-white px-3">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full p-3 text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer rounded-r-lg bg-[#FFC233] px-6 font-semibold text-[#0B1F3A] hover:bg-[#f5b414]"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        {products.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm ${
                  activeCategory === category
                    ? "border-[#0B1F3A] bg-[#0B1F3A] text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:border-[#1E4E8C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={40} className="mx-auto text-slate-400" />
            <p className="mt-3 text-slate-600">
              No products available.
            </p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Search size={40} className="mx-auto text-slate-400" />

            <p className="mt-3 text-slate-700">
              No products match your search.
            </p>

            <button
              onClick={clearSearch}
              className="mt-4 cursor-pointer rounded-lg bg-[#0B1F3A] px-5 py-2 text-white"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing {visibleProducts.length} of {products.length} products
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => {
                const stock = Number(product.quantity);

                return (
                  <div
                    key={product._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#0B1F3A]">
                        {product.category}
                      </span>

                      {stock < 1 && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs text-white">
                          Out of stock
                        </span>
                      )}

                      {stock >= 1 && stock <= 5 && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#FFC233] px-3 py-1 text-xs text-[#0B1F3A]">
                          Only {stock} left
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <h2 className="line-clamp-1 text-lg font-bold text-[#0B1F3A]">
                        {product.title}
                      </h2>

                      <p className="line-clamp-2 text-sm text-slate-500">
                        {product.description}
                      </p>

                      <h3 className="text-xl font-bold text-[#1E4E8C]">
                        Rs. {Number(product.price).toLocaleString("en-PK")}
                      </h3>

                      <div className="mt-auto border-t border-slate-100 pt-3">
                        <p className="text-sm text-slate-600">
                          Company: {product.company}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Stock: {product.quantity}
                        </p>
                      </div>

                      <button
                        onClick={() => openOrder(product)}
                        disabled={stock < 1}
                        className="w-full cursor-pointer rounded-lg bg-[#FFC233] py-2.5 font-semibold text-[#0B1F3A] hover:bg-[#f5b414] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {stock < 1 ? "Out of Stock" : "Buy Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <div
          className="pm-fade fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/70 p-4"
          onClick={closeOrder}
        >
          <div
            className="pm-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pm-cells flex items-center justify-between rounded-t-2xl px-5 py-4">
              <h2 className="text-xl font-bold text-white">
                Place Your Order
              </h2>

              <button
                type="button"
                onClick={closeOrder}
                disabled={orderLoading}
                className="cursor-pointer text-sky-100 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={PlaceOrder} className="p-5">
              <div className="mb-5 flex gap-4 rounded-xl bg-[#EAF2F8] p-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-[#0B1F3A]">
                    {selectedProduct.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedProduct.company}
                  </p>

                  <p className="mt-2 text-lg font-bold text-[#1E4E8C]">
                    Rs. {Number(selectedProduct.price).toLocaleString("en-PK")}
                  </p>
                </div>
              </div>

              <label className="mb-1 block text-sm font-medium text-slate-700">
                Your Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="mb-4 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-[#FFC233]"
              />

              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                required
                className="mb-4 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-[#FFC233]"
              />

              <label className="mb-1 block text-sm font-medium text-slate-700">
                Delivery Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete address"
                required
                rows={3}
                className="mb-4 w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-[#FFC233]"
              />

              <label className="mb-1 block text-sm font-medium text-slate-700">
                Quantity ({selectedProduct.quantity} in stock)
              </label>

              <div className="mb-5 flex items-center">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={Number(quantity) <= 1}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-lg border border-slate-300 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min="1"
                  max={Number(selectedProduct.quantity)}
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setQuantity("");
                    } else {
                      setQuantity(
                        Math.min(
                          Number(selectedProduct.quantity),
                          Math.max(1, Number(value))
                        )
                      );
                    }
                  }}
                  required
                  className="h-10 w-20 border-y border-slate-300 text-center outline-none"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={Number(quantity) >= Number(selectedProduct.quantity)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-lg border border-slate-300 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="mb-5 flex items-center justify-between rounded-xl bg-[#0B1F3A] px-4 py-3 text-white">
                <span className="text-sm text-sky-100">
                  Total Amount
                </span>

                <span className="text-xl font-bold text-[#FFC233]">
                  Rs. {(
                    Number(selectedProduct.price) * Number(quantity || 0)
                  ).toLocaleString("en-PK")}
                </span>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="w-full cursor-pointer rounded-lg bg-[#FFC233] py-3 font-semibold text-[#0B1F3A] hover:bg-[#f5b414] disabled:opacity-50"
              >
                {orderLoading ? "Placing Order..." : "Confirm Order"}
              </button>

              <button
                type="button"
                onClick={closeOrder}
                disabled={orderLoading}
                className="mt-3 w-full cursor-pointer rounded-lg border border-slate-300 py-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products_managment;
