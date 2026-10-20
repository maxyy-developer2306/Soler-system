import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { API_BASE } from "../../config/api";

function Orders({ view = "seller", checkoutSuccess = false }) {
  const navigate = useNavigate();
  const [customerOrders, setCustomerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [notice, setNotice] = useState("");
  const previousOrdersRef = useRef(null);
  const [cancellationOrderId, setCancellationOrderId] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [customCancellationReason, setCustomCancellationReason] = useState("");
  const [chatOrderId, setChatOrderId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatError, setChatError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [removingPurchaseId, setRemovingPurchaseId] = useState("");
  const [purchaseToRemove, setPurchaseToRemove] = useState(null);

  useEffect(() => {
    let isActive = true;
    let requestInFlight = false;

    async function loadOrders() {
      if (requestInFlight) return;
      requestInFlight = true;

      try {
        let currentUserId = null;
        const customerRequest = view === "purchases"
          ? (async () => {
              const sessionResponse = await axios.get(`${API_BASE}/user/check`, {
                withCredentials: true,
                headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }
              });
              currentUserId = sessionResponse.data.user?.id;
              if (!currentUserId) throw new Error("Please sign in to view your purchases.");

              const response = await axios.get(`${API_BASE}/api/orders/customer-orders`, {
                withCredentials: true,
                headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }
              });
              if (String(response.data.ownerId) !== String(currentUserId)) {
                throw new Error("Your account changed. Reload purchases to continue.");
              }
              return response;
            })()
          : Promise.resolve({ data: { orders: [] } });

        const [customerResponse, sellerResponse] = await Promise.all([
          customerRequest,
          view === "seller"
            ? axios.get(`${API_BASE}/api/orders/my-orders`, { withCredentials: true })
            : Promise.resolve({ data: { orders: [] } })
        ]);

        if (isActive) {
          // Defense in depth: ensure we only ever display orders belonging to
          // the currently logged-in user, even if the backend ever returns
          // orders for another account.
          const nextCustomerOrders = (customerResponse.data.orders || []).filter(
            (order) => String(order.userId) === String(currentUserId)
          );
          const nextSellerOrders = sellerResponse.data.orders || [];
          const previousOrders = previousOrdersRef.current;

          if (previousOrders) {
            const changes = [];
            const previousSellerOrders = new Map(
              previousOrders.seller.map((order) => [order._id, order])
            );
            const previousCustomerOrders = new Map(
              previousOrders.customer.map((order) => [order._id, order])
            );

            nextSellerOrders.forEach((order) => {
              const previous = previousSellerOrders.get(order._id);
              if (!previous) {
                changes.push(`New order received: ${order.productTitle}.`);
              } else if (previous.status !== order.status) {
                changes.push(`${order.productTitle} order is now ${order.status}.`);
              }
            });

            nextCustomerOrders.forEach((order) => {
              const previous = previousCustomerOrders.get(order._id);
              if (previous && previous.status !== order.status) {
                changes.push(`Your ${order.productTitle} order is now ${order.status}.`);
              }
            });

            if (changes.length > 0) setNotice(changes.slice(0, 2).join(" "));
          }

          previousOrdersRef.current = {
            customer: nextCustomerOrders,
            seller: nextSellerOrders
          };
          setCustomerOrders(nextCustomerOrders);
          setSellerOrders(nextSellerOrders);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.response?.data?.msg || requestError.message || "Failed to load orders");
          setCustomerOrders([]);
        }
      } finally {
        requestInFlight = false;
        if (isActive) setLoading(false);
      }
    }

    loadOrders();
    const refreshInterval = window.setInterval(loadOrders, 15000);
    return () => {
      isActive = false;
      window.clearInterval(refreshInterval);
    };
  }, [view]);

  useEffect(() => {
    if (!chatOrderId) return undefined;

    let isActive = true;
    let requestInFlight = false;

    async function loadChat() {
      if (requestInFlight) return;
      requestInFlight = true;
      try {
        const response = await axios.get(
          `${API_BASE}/api/orders/${chatOrderId}/messages`,
          { withCredentials: true }
        );
        if (isActive) setChatMessages(response.data.messages || []);
      } catch (requestError) {
        if (isActive) {
          setChatError(requestError.response?.data?.msg || "Could not load order chat");
        }
      } finally {
        requestInFlight = false;
        if (isActive) setChatLoading(false);
      }
    }

    loadChat();
    const interval = window.setInterval(loadChat, 5000);
    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [chatOrderId]);

  async function updateStatus(orderId, status, reason = "") {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await axios.patch(
        `${API_BASE}/api/orders/${orderId}/status`,
        { status, cancellationReason: reason },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updateOrders = (orders) =>
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: response.data.order.status,
                  cancellationReason: response.data.order.cancellationReason || ""
                }
              : order
          );

        setCustomerOrders(updateOrders);
        setSellerOrders(updateOrders);
        return true;
      }
      return false;
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Order status could not be updated");
      return false;
    } finally {
      setUpdatingId("");
    }
  }

  async function submitCancellation(event) {
    event.preventDefault();
    const reason = cancellationReason === "Other"
      ? customCancellationReason.trim()
      : cancellationReason;

    if (!reason || !cancellationOrderId) return;

    const cancelled = await updateStatus(cancellationOrderId, "Cancelled", reason);
    if (!cancelled) return;
    setCancellationOrderId("");
    setCancellationReason("");
    setCustomCancellationReason("");
  }

  function openCancellation(orderId) {
    setCancellationOrderId(orderId);
    setCancellationReason("");
    setCustomCancellationReason("");
  }

  async function sendMessage(event) {
    event.preventDefault();
    const message = chatMessage.trim();
    if (!chatOrderId || !message || sendingMessage) return;

    try {
      setSendingMessage(true);
      setChatError("");
      const response = await axios.post(
        `${API_BASE}/api/orders/${chatOrderId}/messages`,
        { message },
        { withCredentials: true }
      );
      setChatMessages((previousMessages) => [...previousMessages, response.data.message]);
      setChatMessage("");
    } catch (requestError) {
      setChatError(requestError.response?.data?.msg || "Could not send message");
    } finally {
      setSendingMessage(false);
    }
  }

  async function removePurchase() {
    if (!purchaseToRemove) return;
    const order = purchaseToRemove;

    try {
      setRemovingPurchaseId(order._id);
      setError("");
      await axios.delete(
        `${API_BASE}/api/orders/${order._id}/purchase`,
        { withCredentials: true }
      );
      setCustomerOrders((previousOrders) =>
        previousOrders.filter((purchase) => purchase._id !== order._id)
      );
      if (chatOrderId === order._id) setChatOrderId("");
      setNotice(`${order.productTitle} was removed from My Purchases.`);
      setPurchaseToRemove(null);
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Purchase could not be removed");
    } finally {
      setRemovingPurchaseId("");
    }
  }

  function getStatusStyle(status) {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Shipped: "bg-indigo-100 text-indigo-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  }

  const isPurchasesTab = view === "purchases";
  const orders = isPurchasesTab ? customerOrders : sellerOrders;

  if (loading) {
    return <div className="min-w-0 p-4 sm:p-6">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen min-w-0 bg-white p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isPurchasesTab ? "My Purchases" : "Seller Orders"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isPurchasesTab
            ? "Track your purchases and contact each seller."
            : "Manage orders placed for products you sell."}
        </p>
        {checkoutSuccess && (
          <p role="status" className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Purchase successful. Your products are listed below.
          </p>
        )}
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 flex items-start justify-between gap-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
        >
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss order update"
            className="shrink-0 font-medium text-blue-700 hover:text-blue-950"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isPurchasesTab && <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Orders</p>
          <h2 className="mt-2 text-2xl font-semibold">{orders.length}</h2>
        </div>
        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="mt-2 text-2xl font-semibold text-yellow-700">
            {orders.filter((order) => order.status === "Pending").length}
          </h2>
        </div>
        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="mt-2 text-2xl font-semibold text-green-700">
            {orders.filter((order) => order.status === "Delivered").length}
          </h2>
        </div>
      </div>}

      {orders.length === 0 ? (
        <div className="rounded border border-slate-200 p-8 text-center">
          <h2 className="text-lg font-medium text-slate-800">
            {isPurchasesTab ? "No purchases yet" : "No sales yet"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isPurchasesTab
              ? "Products you buy will appear here with their delivery status."
              : "Products ordered from your catalog will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded border border-slate-200 p-4">
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
                    <p className="mt-1 text-sm text-slate-500">Quantity: {order.quantity}</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Total: Rs. {Number(order.totalAmount).toLocaleString("en-PK")}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {isPurchasesTab ? "Purchased" : "Placed"} {new Date(order.createdAt).toLocaleDateString("en-PK")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-3 py-1 text-xs ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                  {isPurchasesTab && (
                    <button
                      type="button"
                      onClick={() => setPurchaseToRemove(order)}
                      disabled={removingPurchaseId === order._id}
                      aria-label={`Remove ${order.productTitle} from My Purchases`}
                      title="Remove from My Purchases"
                      className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                {!isPurchasesTab && (
                  <>
                    <p className="text-sm text-slate-700">Customer: {order.customerName}</p>
                    <p className="mt-1 text-sm text-slate-500">Phone: {order.phone}</p>
                    <p className="mt-1 text-sm text-slate-500">Delivery address: {order.address}</p>
                  </>
                )}
                {isPurchasesTab && order.sellerId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/seller/${order.sellerId}`)}
                    className="mt-2 text-sm text-[#1E4E8C] underline-offset-2 hover:underline"
                  >
                    View seller profile and reviews
                  </button>
                )}
                {order.status === "Cancelled" && order.cancellationReason && (
                  <p className="mt-3 rounded border border-red-100 bg-red-50 p-3 text-sm text-red-800">
                    Cancellation reason: {order.cancellationReason}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {!isPurchasesTab && order.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(order._id, "Confirmed")}
                      disabled={updatingId === order._id}
                      className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      Confirm Order
                    </button>
                  )}
                  {!isPurchasesTab && order.status === "Confirmed" && (
                    <button
                      onClick={() => updateStatus(order._id, "Shipped")}
                      disabled={updatingId === order._id}
                      className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {!isPurchasesTab && order.status === "Shipped" && (
                    <button
                      onClick={() => updateStatus(order._id, "Delivered")}
                      disabled={updatingId === order._id}
                      className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {isPurchasesTab && order.status === "Pending" && (
                    <button
                      onClick={() => openCancellation(order._id)}
                      disabled={updatingId === order._id}
                      className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  )}
                  {isPurchasesTab && order.status === "Shipped" && (
                    <button
                      onClick={() => updateStatus(order._id, "Delivered")}
                      disabled={updatingId === order._id}
                      className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      Confirm Delivery
                    </button>
                  )}
                  {!isPurchasesTab && ["Pending", "Confirmed"].includes(order.status) && (
                    <button
                      onClick={() => openCancellation(order._id)}
                      disabled={updatingId === order._id}
                      className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const nextChatOrderId = chatOrderId === order._id ? "" : order._id;
                      setChatMessages([]);
                      setChatLoading(Boolean(nextChatOrderId));
                      setChatError("");
                      setChatOrderId(nextChatOrderId);
                    }}
                    className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {chatOrderId === order._id
                      ? "Close Chat"
                      : isPurchasesTab ? "Message Seller" : "Message Buyer"}
                  </button>
                  {updatingId === order._id && (
                    <span className="self-center text-sm text-slate-500">Updating...</span>
                  )}
                </div>

                {chatOrderId === order._id && (
                  <section className="mt-4 rounded border border-slate-200 bg-slate-50 p-3" aria-label="Order chat">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {isPurchasesTab ? "Chat with seller" : "Chat with buyer"}
                    </h3>
                    {chatError && <p className="mt-2 text-sm text-red-700">{chatError}</p>}
                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                      {chatLoading && chatMessages.length === 0 ? (
                        <p className="text-sm text-slate-500">Loading messages...</p>
                      ) : chatMessages.length === 0 ? (
                        <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
                      ) : chatMessages.map((item) => (
                        <div key={item._id || `${item.senderId}-${item.createdAt}`} className="rounded bg-white p-2.5">
                          <div className="flex justify-between gap-3 text-xs text-slate-500">
                            <span>{item.senderRole || (String(item.senderId) === String(order.sellerId) ? "Seller" : "Buyer")}</span>
                            <time>{new Date(item.createdAt).toLocaleString("en-PK")}</time>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-slate-800">{item.message}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sendMessage} className="mt-3 flex gap-2">
                      <input
                        value={chatMessage}
                        onChange={(event) => setChatMessage(event.target.value)}
                        maxLength={2000}
                        placeholder="Write a message..."
                        aria-label="Write a message"
                        className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      />
                      <button
                        type="submit"
                        disabled={!chatMessage.trim() || sendingMessage}
                        className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </form>
                  </section>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {purchaseToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-purchase-title"
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h2 id="remove-purchase-title" className="text-base font-semibold text-slate-900">
              Remove from My Purchases?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {purchaseToRemove.productTitle} will be hidden from your list. The seller's order will not be cancelled.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPurchaseToRemove(null)}
                disabled={removingPurchaseId === purchaseToRemove._id}
                className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={removePurchase}
                disabled={removingPurchaseId === purchaseToRemove._id}
                className="rounded bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
              >
                {removingPurchaseId === purchaseToRemove._id ? "Removing..." : "Remove"}
              </button>
            </div>
          </section>
        </div>
      )}
      {cancellationOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={submitCancellation} className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Cancel order</h2>
            <p className="mt-2 text-sm text-slate-600">
              Select a reason so the other person knows why this order was cancelled.
            </p>
            <label htmlFor="cancellation-reason" className="mt-4 block text-sm font-medium text-slate-700">
              Cancellation reason
            </label>
            <select
              id="cancellation-reason"
              value={cancellationReason}
              onChange={(event) => setCancellationReason(event.target.value)}
              required
              className="mt-1 w-full rounded border border-slate-300 p-2.5"
            >
              <option value="">Choose a reason</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found a better price">Found a better price</option>
              <option value="Delivery is taking too long">Delivery is taking too long</option>
              <option value="Out of stock">Out of stock</option>
              <option value="Unable to fulfill the order">Unable to fulfill the order</option>
              <option value="Other">Other</option>
            </select>
            {cancellationReason === "Other" && (
              <textarea
                value={customCancellationReason}
                onChange={(event) => setCustomCancellationReason(event.target.value)}
                maxLength={500}
                required
                rows={3}
                placeholder="Tell us the reason"
                className="mt-3 w-full rounded border border-slate-300 p-2.5"
              />
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellationOrderId("")}
                disabled={updatingId === cancellationOrderId}
                className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                Keep order
              </button>
              <button
                type="submit"
                disabled={updatingId === cancellationOrderId}
                className="rounded bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {updatingId === cancellationOrderId ? "Cancelling..." : "Confirm cancellation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Orders;