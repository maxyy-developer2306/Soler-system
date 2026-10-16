
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  RefreshCw,
  Trash2,
  Search,
  LogOut,
  Sun,
  AlertTriangle
} from "lucide-react"
import { API_BASE } from "../../config/api"

const API = API_BASE

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Users", icon: Users },
  { name: "Products", icon: Package },
  { name: "Orders", icon: ShoppingCart }
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [dashboard, setDashboard] = useState({})
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingProduct, setDeletingProduct] = useState("")
  const [updatingOrder, setUpdatingOrder] = useState("")

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API}/api/admin${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      const error = new Error(data.msg || "Something went wrong")
      error.status = response.status
      throw error
    }

    return data
  }

  async function loadData() {
    setLoading(true)
    setError("")

    try {
      const [dashboardData, usersData, productsData, ordersData] =
        await Promise.all([
          apiRequest("/dashboard"),
          apiRequest("/users"),
          apiRequest("/products"),
          apiRequest("/orders")
        ])

      setDashboard(dashboardData.dashboard || {})
      setUsers(usersData.users || [])
      setProducts(productsData.products || [])
      setOrders(ordersData.orders || [])
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        window.location.replace("/Login")
        return
      }
      setError(error.message || "Unable to load admin data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    )

    if (!confirmDelete) return

    setDeletingProduct(id)
    setError("")

    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE"
      })

      setProducts(oldProducts =>
        oldProducts.filter(product => product._id !== id)
      )

      const updated = await apiRequest("/dashboard")
      setDashboard(updated.dashboard || {})
    } catch (error) {
      window.alert(error.message || "Unable to delete product")
    } finally {
      setDeletingProduct("")
    }
  }

  async function updateOrderStatus(orderId, status) {
    setUpdatingOrder(orderId)
    setError("")

    try {
      const response = await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      })

      setOrders(currentOrders =>
        currentOrders.map(order =>
          order._id === orderId ? response.order : order
        )
      )

      const updatedRequests = [apiRequest("/dashboard")]
      if (status === "Cancelled") {
        updatedRequests.push(apiRequest("/products"))
      }

      const [updated, productData] = await Promise.all(updatedRequests)
      setDashboard(updated.dashboard || {})
      if (productData) {
        setProducts(productData.products || [])
      }
    } catch (error) {
      setError(error.message || "Unable to update order status")
    } finally {
      setUpdatingOrder("")
    }
  }

  async function logout() {
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
        credentials: "include"
      })
    } catch {
      setError("Could not confirm logout with the server.")
    } finally {
      window.location.assign("/Login")
    }
  }

  function formatDate(date) {
    if (!date) return "—"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return "—"

    return parsedDate.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  function money(amount) {
    return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`
  }

  function statusStyle(status) {
    const styles = {
      Pending: "bg-amber-50 text-amber-700",
      Confirmed: "bg-blue-50 text-blue-700",
      Shipped: "bg-indigo-50 text-indigo-700",
      Delivered: "bg-slate-100 text-slate-700",
      Cancelled: "bg-red-50 text-red-700"
    }

    return styles[status] || "bg-slate-100 text-slate-700"
  }

  const filteredUsers = users.filter(user =>
    `${user.name || ""} ${user.email || ""} ${user.role || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredProducts = products.filter(product =>
    `${product.title || ""} ${product.company || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredOrders = orders.filter(order =>
    `${order.customerName || ""} ${order.productTitle || ""} ${order.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: Users
    },
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingCart
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: RefreshCw
    },
    {
      title: "Low Stock (5 or less)",
      value: dashboard.lowStockProducts,
      icon: AlertTriangle
    }
  ]

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <div className="flex min-h-screen flex-col md:flex-row">

        <aside className="w-full shrink-0 border-b border-[#e5e5e5] bg-white md:w-[225px] md:border-b-0 md:border-r">
          <div className="flex h-16 items-center gap-3 border-b border-[#e5e5e5] px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e5e5]">
              <Sun size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold">Solar System</p>
              <p className="text-xs text-[#737373]">Owner Dashboard</p>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon
              const active = activeTab === item.name

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name)
                    setSearch("")
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition md:w-full ${
                    active
                      ? "bg-[#f5f5f5] font-medium text-[#171717]"
                      : "text-[#737373] hover:bg-[#fafafa] hover:text-[#171717]"
                  }`}
                >
                  <Icon size={17} />
                  {item.name}
                </button>
              )
            })}
          </div>

          <div className="hidden border-t border-[#e5e5e5] p-3 md:block">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#737373] hover:bg-[#fafafa] hover:text-[#171717]"
            >
              <LogOut size={17} />
              Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#fafafa]">
          <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[#e5e5e5] bg-white px-4 md:px-8">
            <div>
              <h1 className="text-lg font-semibold">{activeTab}</h1>
              <p className="text-xs text-[#737373]">
                Manage your solar marketplace
              </p>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3 py-2 text-sm hover:bg-[#fafafa] disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </header>

          <div className="p-4 md:p-8">
            {error && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span>{error}</span>
                <button
                  onClick={loadData}
                  className="font-medium underline"
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <div className="rounded-xl border border-[#e5e5e5] bg-white p-10 text-center text-sm text-[#737373]">
                Loading dashboard...
              </div>
            ) : (
              <>
                {activeTab === "Dashboard" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold">Overview</h2>
                      <p className="mt-1 text-sm text-[#737373]">
                        Here is what is happening in your marketplace.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      {stats.map(item => {
                        const Icon = item.icon

                        return (
                          <div
                            key={item.title}
                            className="rounded-xl border border-[#e5e5e5] bg-white p-5"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-[#737373]">
                                {item.title}
                              </p>
                              <Icon size={18} className="text-[#737373]" />
                            </div>

                            <p className="mt-4 text-2xl font-semibold tracking-tight">
                              {Number(item.value || 0).toLocaleString()}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="rounded-xl border border-[#e5e5e5] bg-white">
                      <div className="border-b border-[#e5e5e5] p-5">
                        <h3 className="text-sm font-semibold">Recent Orders</h3>
                        <p className="mt-1 text-xs text-[#737373]">
                          Latest marketplace orders
                        </p>
                      </div>

                      {orders.length === 0 ? (
                        <p className="p-5 text-sm text-[#737373]">
                          No orders found.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px] text-left text-sm">
                            <thead className="bg-[#fafafa] text-xs text-[#737373]">
                              <tr>
                                <th className="px-5 py-3 font-medium">Product</th>
                                <th className="px-5 py-3 font-medium">Customer</th>
                                <th className="px-5 py-3 font-medium">Amount</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map(order => (
                                <tr key={order._id} className="border-t border-[#e5e5e5]">
                                  <td className="px-5 py-4 font-medium">
                                    {order.productTitle || "Product"}
                                  </td>
                                  <td className="px-5 py-4 text-[#737373]">
                                    {order.customerName || "—"}
                                  </td>
                                  <td className="px-5 py-4">
                                    {money(order.totalAmount)}
                                  </td>
                                  <td className="px-5 py-4">
                                    <span className={`rounded-md px-2 py-1 text-xs ${statusStyle(order.status)}`}>
                                      {order.status || "Pending"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="border-t border-[#e5e5e5] p-4">
                        <button
                          onClick={() => {
                            setActiveTab("Orders")
                            setSearch("")
                          }}
                          className="text-sm font-medium hover:underline"
                        >
                          View all orders →
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#e5e5e5] bg-white p-5">
                      <p className="text-sm text-[#737373]">
                        Non-cancelled order value (not payment-verified)
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {money(dashboard.totalSales)}
                      </p>
                      <p className="mt-1 text-xs text-[#737373]">
                        Calculated from order totals; payment status is not verified.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "Users" && (
                  <div className="rounded-xl border border-[#e5e5e5] bg-white">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#e5e5e5] p-5 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="font-semibold">All Users</h2>
                        <p className="mt-1 text-xs text-[#737373]">
                          {users.length} registered accounts
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3">
                        <Search size={16} className="text-[#737373]" />
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search users..."
                          className="w-full py-2 text-sm outline-none sm:w-48"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="bg-[#fafafa] text-xs text-[#737373]">
                          <tr>
                            <th className="px-5 py-3 font-medium">Name</th>
                            <th className="px-5 py-3 font-medium">Email</th>
                            <th className="px-5 py-3 font-medium">Phone</th>
                            <th className="px-5 py-3 font-medium">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(user => (
                            <tr key={user._id} className="border-t border-[#e5e5e5]">
                              <td className="px-5 py-4 font-medium">
                                {user.name || "—"}
                              </td>
                              <td className="px-5 py-4 text-[#737373]">
                                {user.email || "—"}
                              </td>
                              <td className="px-5 py-4">{user.phone || "—"}</td>
                              <td className="px-5 py-4">
                                <span className="rounded-md border border-[#e5e5e5] px-2 py-1 text-xs">
                                  {user.role || "user"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredUsers.length === 0 && (
                      <p className="p-6 text-center text-sm text-[#737373]">
                        No users found.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "Products" && (
                  <div className="rounded-xl border border-[#e5e5e5] bg-white">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#e5e5e5] p-5 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="font-semibold">All Products</h2>
                        <p className="mt-1 text-xs text-[#737373]">
                          {products.length} marketplace products
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3">
                        <Search size={16} className="text-[#737373]" />
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full py-2 text-sm outline-none sm:w-48"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-[#fafafa] text-xs text-[#737373]">
                          <tr>
                            <th className="px-5 py-3 font-medium">Product</th>
                            <th className="px-5 py-3 font-medium">Category</th>
                            <th className="px-5 py-3 font-medium">Price</th>
                            <th className="px-5 py-3 font-medium">Stock</th>
                            <th className="px-5 py-3 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map(product => (
                            <tr key={product._id} className="border-t border-[#e5e5e5]">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.title || "Product"}
                                      className="h-10 w-10 rounded-md border border-[#e5e5e5] object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#e5e5e5]">
                                      <Package size={17} />
                                    </div>
                                  )}

                                  <div>
                                    <p className="font-medium">
                                      {product.title || "Untitled"}
                                    </p>
                                    <p className="mt-1 text-xs text-[#737373]">
                                      {product.company || "—"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-[#737373]">
                                {product.category || "—"}
                              </td>
                              <td className="px-5 py-4">{money(product.price)}</td>
                              <td className="px-5 py-4">
                                {product.quantity ?? 0}
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => deleteProduct(product._id)}
                                  disabled={deletingProduct === product._id}
                                  className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3 py-2 text-xs hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  {deletingProduct === product._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredProducts.length === 0 && (
                      <p className="p-6 text-center text-sm text-[#737373]">
                        No products found.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "Orders" && (
                  <div className="rounded-xl border border-[#e5e5e5] bg-white">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#e5e5e5] p-5 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="font-semibold">All Orders</h2>
                        <p className="mt-1 text-xs text-[#737373]">
                          {orders.length} marketplace orders
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] px-3">
                        <Search size={16} className="text-[#737373]" />
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search orders..."
                          className="w-full py-2 text-sm outline-none sm:w-48"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-[#fafafa] text-xs text-[#737373]">
                          <tr>
                            <th className="px-5 py-3 font-medium">Product</th>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Quantity</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map(order => (
                            <tr key={order._id} className="border-t border-[#e5e5e5]">
                              <td className="px-5 py-4 font-medium">
                                {order.productTitle || "Product"}
                              </td>
                              <td className="px-5 py-4">
                                <p>{order.customerName || "—"}</p>
                                <p className="mt-1 text-xs text-[#737373]">
                                  {order.phone || ""}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                {order.quantity || 0}
                              </td>
                              <td className="px-5 py-4">
                                {money(order.totalAmount)}
                              </td>
                              <td className="px-5 py-4 text-[#737373]">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="px-5 py-4">
                                <select
                                  value={order.status || "Pending"}
                                  onChange={event =>
                                    updateOrderStatus(order._id, event.target.value)
                                  }
                                  disabled={
                                    updatingOrder === order._id ||
                                    ["Delivered", "Cancelled"].includes(order.status)
                                  }
                                  className={`rounded-md border border-[#e5e5e5] px-2 py-1 text-xs ${statusStyle(order.status)} disabled:cursor-not-allowed disabled:opacity-70`}
                                >
                                  <option value={order.status || "Pending"}>
                                    {order.status || "Pending"}
                                  </option>
                                  {(order.status === "Pending"
                                    ? ["Confirmed", "Cancelled"]
                                    : order.status === "Confirmed"
                                      ? ["Shipped", "Cancelled"]
                                      : order.status === "Shipped"
                                        ? ["Delivered"]
                                        : []
                                  ).map(status => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredOrders.length === 0 && (
                      <p className="p-6 text-center text-sm text-[#737373]">
                        No orders found.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
