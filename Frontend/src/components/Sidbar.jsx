
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  
  LogOut,
  ArrowLeft,
  X,
  AlertTriangle
} from "lucide-react"

function Sidbar() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Create Product", icon: PlusCircle, path: "/Myprodcuts" },
    { name: "History", icon: History, path: "/history" },
    { name: "Orders", icon: User, path: "/Orders" },
   
  ]

  function handleLogout() {
    setShowLogout(false)
    navigate("/login")
  }

  return (
    <>
      <nav className="sticky top-0 z-40 flex gap-1 overflow-x-auto border-b border-slate-700 bg-[#0B1F3A] px-3 py-2 text-white md:hidden">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-200 hover:bg-[#1E4E8C]"
            >
              <Icon size={16} />
              {item.name}
            </button>
          )
        })}
        <button
          onClick={() => navigate("/Products_managment")}
          aria-label="Back to products"
          title="Back to products"
          className="flex shrink-0 items-center rounded-md px-3 py-2 text-slate-200 hover:bg-[#1E4E8C]"
        >
          <ArrowLeft size={17} />
        </button>
        <button
          onClick={() => setShowLogout(true)}
          aria-label="Logout"
          title="Logout"
          className="flex shrink-0 items-center rounded-md px-3 py-2 text-slate-200 hover:bg-red-500/20"
        >
          <LogOut size={17} />
        </button>
      </nav>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-700 bg-[#0B1F3A] px-4 py-5 text-white md:flex">

        <div className="mb-8 flex items-center gap-2 px-2">
         

          <h2 className="text-lg font-semibold tracking-tight">
            Solar <span className="text-[#FFC233]">Energy</span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/Products_managment")}
          className="mb-7 flex cursor-pointer items-center gap-3 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-[#1E4E8C] hover:text-white"
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <button
            onClick={() => setShowLogout(true)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Logout</span>
          </button>

          <p className="mt-4 px-3 text-xs text-slate-500">
            Solar Energy Dashboard
          </p>
        </div>
      </aside>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-xl">

            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={21} />
              </div>

              <button
                onClick={() => setShowLogout(false)}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Logout Confirmation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default Sidbar
