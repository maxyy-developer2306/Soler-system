import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, Star } from "lucide-react";
import { API_BASE } from "../../config/api";

function SellerProfile() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSeller() {
      try {
        const response = await axios.get(
          `${API_BASE}/api/profile/seller/${sellerId}`,
          { withCredentials: true }
        );
        if (isActive) setSeller(response.data.seller);
      } catch (requestError) {
        if (isActive) {
          setError(requestError.response?.data?.msg || "Seller profile could not be loaded.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadSeller();
    return () => {
      isActive = false;
    };
  }, [sellerId]);

  async function submitReview(event) {
    event.preventDefault();
    if (!seller?.eligibleOrderId || submitting) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await axios.post(
        `${API_BASE}/api/profile/seller/${sellerId}/reviews`,
        {
          orderId: seller.eligibleOrderId,
          rating,
          comment: comment.trim()
        },
        { withCredentials: true }
      );

      setSeller((previousSeller) => {
        const reviews = [response.data.review, ...previousSeller.reviews];
        return {
          ...previousSeller,
          reviews,
          reviewCount: reviews.length,
          ratingAverage: reviews.reduce((total, review) => total + review.rating, 0) / reviews.length,
          eligibleOrderId: ""
        };
      });
      setComment("");
      setNotice("Your review was posted.");
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Review could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6 text-slate-500">Loading seller...</p>;
  if (error && !seller) return <p className="p-6 text-red-700">{error}</p>;
  if (!seller) return null;

  const profile = seller.profile || {};

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seller storefront</p>
            <h1 className="mt-1 text-2xl font-semibold">{seller.name}</h1>
          </div>
          <Link
            to="/Products_managment"
            className="rounded bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E4E8C]"
          >
            Browse products
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit border-b border-slate-200 bg-white p-5 lg:border lg:border-slate-200">
          <div className="flex items-center gap-4">
            {profile.image ? (
              <img src={profile.image} alt={seller.name} className="h-20 w-20 rounded-full border border-slate-200 object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0B1F3A] text-2xl font-semibold text-white">
                {seller.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
            )}
            <div>
              <h2 className="font-semibold">{seller.name}</h2>
              <p className="mt-1 text-sm capitalize text-slate-500">{seller.role || "Seller"}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <Star size={17} className="fill-amber-400 text-amber-500" />
            <span className="font-semibold">{seller.reviewCount ? seller.ratingAverage.toFixed(1) : "New"}</span>
            <span className="text-slate-500">({seller.reviewCount} reviews)</span>
          </div>

          {(profile.company || profile.occupation) && (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <Building2 size={16} /> {profile.company || profile.occupation}
            </p>
          )}
          {(profile.city || profile.country) && (
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} /> {[profile.city, profile.country].filter(Boolean).join(", ")}
            </p>
          )}
          {profile.bio && <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">{profile.bio}</p>}
          {profile.address && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">{profile.address}</p>}
        </aside>

        <div className="min-w-0">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Products</h2>
                <p className="mt-1 text-sm text-slate-500">{seller.products.length} listed</p>
              </div>
            </div>
            {seller.products.length === 0 ? (
              <p className="border-y border-slate-200 py-8 text-sm text-slate-500">This seller has no listed products.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {seller.products.map((product) => (
                  <article key={product._id} className="overflow-hidden border border-slate-200 bg-white">
                    <img src={product.image} alt={product.title} className="h-40 w-full bg-slate-100 object-cover" />
                    <div className="p-4">
                      <p className="text-xs text-slate-500">{product.category}</p>
                      <h3 className="mt-1 font-semibold">{product.title}</h3>
                      <p className="mt-3 font-semibold text-[#1E4E8C]">Rs. {Number(product.price).toLocaleString("en-PK")}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Buyer reviews</h2>
            {notice && <p role="status" className="mt-3 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
            {error && <p role="alert" className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

            {seller.eligibleOrderId && (
              <form onSubmit={submitReview} className="mt-4 border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium">You can review this seller after your delivery.</p>
                <div className="mt-3 flex gap-1" role="group" aria-label="Seller rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={rating === value}
                      className="p-1"
                    >
                      <Star size={22} className={value <= rating ? "fill-amber-400 text-amber-500" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Share your experience"
                  className="mt-3 w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-slate-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 rounded bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E4E8C] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit review"}
                </button>
              </form>
            )}

            {seller.reviews.length === 0 ? (
              <p className="mt-4 border-y border-slate-200 py-6 text-sm text-slate-500">No reviews yet.</p>
            ) : (
              <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                {seller.reviews.map((review) => (
                  <article key={review._id} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{review.buyerName}</p>
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <Star size={15} className="fill-amber-400 text-amber-500" /> {review.rating}/5
                      </p>
                    </div>
                    {review.comment && <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>}
                    {review.createdAt && <time className="mt-2 block text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString("en-PK")}</time>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default SellerProfile;