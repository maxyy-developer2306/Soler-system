const developmentApiUrl = (
  import.meta.env.VITE_backend_Url || "http://localhost:4000"
).replace(/\/$/, "")

export const API_BASE = import.meta.env.PROD ? "" : developmentApiUrl