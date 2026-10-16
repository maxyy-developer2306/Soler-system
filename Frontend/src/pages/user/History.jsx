
import { useEffect, useState } from "react"
import { Calendar, Clock, History as HistoryIcon } from "lucide-react"

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_backend_Url}/api/history`,
          {
            method: "GET",
            credentials: "include"
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.msg || "History fetch failed")
        }

        setHistory(data.history || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <div className="ml-64 min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-7 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <HistoryIcon size={23} className="text-slate-700" />

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                History
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Your products, calculations and orders history
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Total Activities: {history.length}
          </p>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading history...
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 py-12 text-center">
            <HistoryIcon size={30} className="mx-auto text-slate-400" />

            <h2 className="mt-3 text-base font-medium text-slate-800">
              No History Yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your activities will appear here.
            </p>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {history.map((item) => (
              <div
                key={item._id}
                className="py-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-base font-medium capitalize text-slate-900">
                    {item.type}
                  </h2>

                  <span className="rounded-md border border-slate-200 px-2 py-1 text-xs capitalize text-slate-600">
                    {item.type}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.message}
                </p>

                <div className="mt-3 flex flex-wrap gap-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(item.createdAt)}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatTime(item.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default History
