import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../config/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const API = API_BASE;

  async function getOrders() {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API}/api/orders/my-orders`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError(res.data.msg || "Orders fetch nahi huay");
      }
    } catch (error) {
      setError(
        error.response?.data?.msg || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  async function confirmOrder(orderId) {
    try {
      setUpdatingId(orderId);
      setError("");

      const res = await axios.patch(
        `${API}/api/orders/${orderId}/status`,
        { status: "Confirmed" },
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: "Confirmed" }
              : order
          )
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.msg || "Order confirm nahi hua"
      );
    } finally {
      setUpdatingId("");
    }
  }

  function getStatusStyle(status) {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-800";
    }

    if (status === "Confirmed") {
      return "bg-blue-100 text-blue-800";
    }

    return "bg-slate-100 text-slate-700";
  }

  if (loading) {
    return (
      <div className="ml-64 p-6">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-white p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage orders received for your products.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Orders</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {orders.length}
          </h2>
        </div>

        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pending Orders</p>
          <h2 className="mt-2 text-2xl font-semibold text-yellow-700">
            {orders.filter((order) => order.status === "Pending").length}
          </h2>
        </div>

        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Confirmed Orders</p>
          <h2 className="mt-2 text-2xl font-semibold text-blue-700">
            {orders.filter((order) => order.status === "Confirmed").length}
          </h2>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded border border-slate-200 p-8 text-center">
          <h2 className="text-lg font-medium text-slate-800">
            No Orders Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Jab koi customer tumhare products order karega,
            order yahan show hoga.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {order.productImage && (
                    <img
                      src={order.productImage}
                      alt={order.productTitle || "Product"}
                      className="h-16 w-16 rounded border object-cover"
                    />
                  )}

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {order.productTitle || "Product"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {order.quantity}
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      Total: Rs. {order.totalAmount}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded px-3 py-1 text-xs ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-sm text-slate-700">
                  Customer: {order.customerName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Phone: {order.phone}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Address: {order.address}
                </p>

                {order.status === "Pending" && (
                  <button
                    onClick={() => confirmOrder(order._id)}
                    disabled={updatingId === order._id}
                    className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    {updatingId === order._id
                      ? "Updating..."
                      : "Confirm Order"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;