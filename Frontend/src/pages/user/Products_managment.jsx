import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  X,
  Minus,
  Plus,
  Package,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Trash2
} from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../config/api";

const API = API_BASE;

const styles = `
.pm-page {
  min-height: 100vh;
  background: #f5f7fa;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 14px;
}

.pm-page * {
  box-sizing: border-box;
}

.pm-page button {
  font-family: inherit;
  cursor: pointer;
}

.pm-page button:disabled {
  cursor: not-allowed;
}

/* Animations */
@keyframes pm-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pm-pop {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}

@keyframes pm-slide {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes pm-progress {
  from { width: 100%; }
  to { width: 0%; }
}

.pm-fade { animation: pm-fade 0.2s ease-out; }
.pm-pop { animation: pm-pop 0.25s ease-out; }
.pm-slide { animation: pm-slide 0.25s ease-out; }
.pm-progress-bar { animation: pm-progress 5s linear forwards; }

/* Toast message */
.pm-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  width: calc(100% - 40px);
  max-width: 360px;
}

.pm-toast-box {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px 18px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-left: 3px solid #2563eb;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
}

.pm-toast-box.error { border-left-color: #dc2626; }

.pm-toast-icon { flex-shrink: 0; color: #2563eb; }
.pm-toast-box.error .pm-toast-icon { color: #dc2626; }

.pm-toast-text { flex: 1; }

.pm-toast-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.pm-toast-msg {
  margin: 3px 0 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.pm-toast-close {
  background: none;
  border: none;
  padding: 0;
  color: #9ca3af;
}

.pm-toast-close:hover { color: #374151; }

.pm-toast-track {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #f3f4f6;
}

.pm-toast-bar {
  height: 100%;
  background: #2563eb;
}

.pm-toast-box.error .pm-toast-bar { background: #dc2626; }

/* Header */
.pm-header {
  background: #0B1F3A;
}

.pm-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 26px;
}

.pm-header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.pm-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
}

.pm-subtitle {
  margin: 6px 0 0;
  max-width: 480px;
  font-size: 14px;
  color: #aebed3;
}

.pm-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pm-head-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.pm-head-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Search */
.pm-search {
  display: flex;
  max-width: 620px;
  margin-top: 22px;
}

.pm-search-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #fff;
  border-radius: 4px 0 0 4px;
  color: #9ca3af;
}

.pm-search-field input {
  width: 100%;
  height: 42px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1f2937;
}

.pm-search-btn {
  height: 42px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #1E4E8C;
  border: none;
  border-radius: 0 4px 4px 0;
  transition: background 0.15s;
}

.pm-search-btn:hover { background: #2a5fa3; }

/* Content */
.pm-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.pm-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.pm-category {
  padding: 6px 14px;
  font-size: 13px;
  color: #4b5563;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  transition: border-color 0.15s, color 0.15s;
}

.pm-category:hover { border-color: #1E4E8C; color: #1E4E8C; }

.pm-category.active {
  color: #fff;
  background: #0B1F3A;
  border-color: #0B1F3A;
}

.pm-count {
  margin: 0 0 14px;
  font-size: 13px;
  color: #6b7280;
}

.pm-empty {
  padding: 70px 0;
  text-align: center;
  color: #6b7280;
}

.pm-empty svg { color: #9ca3af; }
.pm-empty p { margin: 12px 0 0; }

.pm-empty-btn {
  margin-top: 16px;
  height: 36px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #0B1F3A;
  border: none;
  border-radius: 4px;
}

/* Product grid */
.pm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.pm-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.pm-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.pm-card-img {
  position: relative;
  height: 190px;
  background: #f3f4f6;
  border-bottom: 1px solid #f0f1f3;
  overflow: hidden;
}

.pm-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pm-badge {
  position: absolute;
  top: 10px;
  padding: 3px 9px;
  font-size: 11px;
  border-radius: 3px;
}

.pm-badge.category {
  left: 10px;
  color: #374151;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
}

.pm-badge.out {
  right: 10px;
  color: #fff;
  background: #dc2626;
}

.pm-badge.low {
  right: 10px;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
}

.pm-card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px;
}

.pm-card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.pm-card-company {
  margin: 3px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.pm-card-desc {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: #6b7280;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pm-card-price {
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: 600;
  color: #0B1F3A;
}

.pm-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  font-size: 12px;
  color: #6b7280;
}

.pm-link {
  padding: 0;
  font-size: 12px;
  color: #1E4E8C;
  background: none;
  border: none;
}

.pm-link:hover { text-decoration: underline; }

.pm-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.pm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.pm-btn.outline {
  color: #0B1F3A;
  background: #fff;
  border: 1px solid #cbd5e1;
}

.pm-btn.outline:hover { background: #f8fafc; border-color: #94a3b8; }

.pm-btn.solid {
  color: #fff;
  background: #0B1F3A;
  border: 1px solid #0B1F3A;
}

.pm-btn.solid:hover { background: #16345c; }

.pm-btn:disabled {
  opacity: 0.5;
}

.pm-btn.solid:disabled {
  color: #9ca3af;
  background: #f3f4f6;
  border-color: #e5e7eb;
  opacity: 1;
}

/* Overlay + cart drawer */
.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.5);
}

.pm-overlay.drawer {
  display: flex;
  justify-content: flex-end;
}

.pm-overlay.center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.pm-drawer {
  width: 100%;
  max-width: 440px;
  height: 100%;
  overflow-y: auto;
  padding: 22px;
  background: #fff;
  box-shadow: -4px 0 24px rgba(15, 23, 42, 0.15);
}

.pm-drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.pm-drawer-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.pm-drawer-sub {
  margin: 3px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.pm-icon-btn {
  display: flex;
  padding: 6px;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 4px;
}

.pm-icon-btn:hover { background: #f3f4f6; color: #111827; }

.pm-cart-list { margin-top: 4px; }

.pm-cart-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f1f3;
}

.pm-cart-item img {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.pm-cart-info { flex: 1; min-width: 0; }

.pm-cart-name {
  margin: 0;
  font-size: 14px;
  color: #111827;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pm-cart-price {
  margin: 3px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.pm-cart-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.pm-qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #374151;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.pm-qty-btn:hover:not(:disabled) { background: #f9fafb; }
.pm-qty-btn:disabled { opacity: 0.4; }

.pm-qty-num {
  width: 26px;
  text-align: center;
  font-size: 13px;
}

.pm-remove {
  display: flex;
  margin-left: auto;
  padding: 6px;
  color: #9ca3af;
  background: none;
  border: none;
  border-radius: 4px;
}

.pm-remove:hover { color: #dc2626; background: #fef2f2; }

.pm-cart-total {
  flex-shrink: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.pm-subtotal {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 15px;
  font-weight: 600;
  color: #0B1F3A;
}

.pm-form-title {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.pm-input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2937;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.15s;
}

.pm-input:focus { border-color: #1E4E8C; }

.pm-main-btn {
  width: 100%;
  height: 42px;
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #0B1F3A;
  border: none;
  border-radius: 4px;
  transition: background 0.15s;
}

.pm-main-btn:hover:not(:disabled) { background: #16345c; }
.pm-main-btn:disabled { opacity: 0.5; }

.pm-text-btn {
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  font-size: 13px;
  color: #6b7280;
  background: none;
  border: none;
}

.pm-text-btn:hover { color: #111827; }

.pm-cart-empty {
  padding: 60px 0;
  text-align: center;
  color: #6b7280;
}

.pm-cart-empty svg { color: #9ca3af; }
.pm-cart-empty p { margin: 12px 0 0; }

/* Order modal */
.pm-modal {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.2);
}

.pm-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.pm-modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #111827;
}

.pm-modal-body { padding: 20px; }

.pm-summary {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.pm-summary img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.pm-summary h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.pm-summary p {
  margin: 3px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.pm-summary .price {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #0B1F3A;
}

.pm-label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #4b5563;
}

.pm-modal .pm-input { margin-bottom: 14px; }

.pm-qty-row {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.pm-qty-row button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #374151;
  background: #fff;
  border: 1px solid #d1d5db;
}

.pm-qty-row button:first-child { border-radius: 4px 0 0 4px; }
.pm-qty-row button:last-child { border-radius: 0 4px 4px 0; }
.pm-qty-row button:disabled { opacity: 0.45; }

.pm-qty-row input {
  width: 64px;
  height: 38px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-left: none;
  border-right: none;
  outline: none;
}

.pm-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  color: #4b5563;
}

.pm-total strong {
  font-size: 17px;
  font-weight: 600;
  color: #0B1F3A;
}

.pm-cancel-btn {
  width: 100%;
  height: 40px;
  margin-top: 8px;
  font-size: 14px;
  color: #4b5563;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.pm-cancel-btn:hover:not(:disabled) { background: #f9fafb; }
.pm-cancel-btn:disabled { opacity: 0.5; }

@media (max-width: 600px) {
  .pm-header-inner { padding: 22px 16px; }
  .pm-content { padding: 16px; }
  .pm-title { font-size: 22px; }
  .pm-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .pm-card-img { height: 140px; }
}

@media (max-width: 420px) {
  .pm-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .pm-fade, .pm-pop, .pm-slide, .pm-progress-bar {
    animation: none;
  }
}
`;

function Products_managment() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("solar-cart") || "[]");
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCheckout, setCartCheckout] = useState(false);

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
    window.localStorage.setItem("solar-cart", JSON.stringify(cart));
  }, [cart]);

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
      } catch {
        navigate("/Login", { replace: true });
      }
    }

    checkLogin();
  }, [navigate]);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        const response = await axios.get(`${API}/api/products/products`);
        if (isActive) setProducts(response.data.products || []);
      } catch (error) {
        if (isActive) {
          console.log("Products Error:", error);
          setMessageType("error");
          setMessage(error.response?.data?.msg || "Products load nahi huay.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isActive = false;
    };
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
        setMessage("Order placed successfully. You can track it in My Purchases.");
        navigate("/MyPurchases", { state: { checkoutSuccess: true } });
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

  function addToCart(product) {
    const existingItem = cart.find((item) => item.productId === product._id);
    if (existingItem && existingItem.quantity >= Number(product.quantity)) {
      setMessageType("error");
      setMessage("Cart quantity cannot exceed available stock.");
      return;
    }

    setMessageType("success");
    setMessage(`${product.title} added to your cart.`);
    setCart(existingItem
      ? cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1, stock: Number(product.quantity) }
            : item
        )
      : [...cart, {
          productId: product._id,
          title: product.title,
          image: product.image,
          price: Number(product.price),
          quantity: 1,
          stock: Number(product.quantity)
        }]
    );
  }

  function changeCartQuantity(productId, change) {
    setCart((previousCart) => previousCart.map((item) => {
      if (item.productId !== productId) return item;
      return {
        ...item,
        quantity: Math.min(item.stock, Math.max(1, item.quantity + change))
      };
    }));
  }

  function removeFromCart(productId) {
    setCart((previousCart) => previousCart.filter((item) => item.productId !== productId));
  }

  async function placeCartOrder(e) {
    e.preventDefault();

    if (cart.length === 0 || orderLoading) return;

    try {
      setOrderLoading(true);
      const response = await axios.post(
        `${API}/api/orders/create`,
        {
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          items: cart.map(({ productId, quantity }) => ({ productId, quantity }))
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || "Checkout failed");
      }

      setProducts((previousProducts) => previousProducts.map((product) => {
        const cartItem = cart.find((item) => item.productId === product._id);
        return cartItem
          ? { ...product, quantity: Number(product.quantity) - cartItem.quantity }
          : product;
      }));
      setCart([]);
      setCartOpen(false);
      setCartCheckout(false);
      setName("");
      setPhone("");
      setAddress("");
      setMessageType("success");
      setMessage("Order placed successfully. You can track it in My Purchases.");
      navigate("/MyPurchases", { state: { checkoutSuccess: true } });
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.msg || error.message || "Checkout failed. Please try again.");
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
    <div className="pm-page">
      <style>{styles}</style>

      {message && (
        <div className="pm-toast pm-pop">
          <div className={`pm-toast-box ${messageType === "success" ? "" : "error"}`}>
            {messageType === "success" ? (
              <CheckCircle size={20} className="pm-toast-icon" />
            ) : (
              <AlertCircle size={20} className="pm-toast-icon" />
            )}

            <div className="pm-toast-text">
              <h3 className="pm-toast-title">
                {messageType === "success" ? "Success" : "Error"}
              </h3>

              <p className="pm-toast-msg">{message}</p>
            </div>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="pm-toast-close"
            >
              <X size={16} />
            </button>

            <div className="pm-toast-track">
              <div key={message} className="pm-toast-bar pm-progress-bar" />
            </div>
          </div>
        </div>
      )}

      <div className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-header-top">
            <div>
              <h2 className="pm-title">Solar Products</h2>

              <p className="pm-subtitle">
                Browse solar panels, batteries and inverters from vendors.
              </p>
            </div>

            <div className="pm-header-actions">
              <button
                onClick={() => setCartOpen(true)}
                className="pm-head-btn"
                aria-label={`Open cart, ${cart.reduce((total, item) => total + item.quantity, 0)} items`}
              >
                <ShoppingCart size={17} />
                Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="pm-head-btn"
              >
                <User size={17} />
                Profile
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="pm-search">
            <div className="pm-search-field">
              <Search size={17} />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
              />
            </div>

            <button type="submit" className="pm-search-btn">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="pm-content">
        {products.length > 0 && (
          <div className="pm-categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pm-category ${activeCategory === category ? "active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="pm-empty">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="pm-empty">
            <Package size={38} />
            <p>No products available.</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="pm-empty">
            <Search size={38} />

            <p>No products match your search.</p>

            <button onClick={clearSearch} className="pm-empty-btn">
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <p className="pm-count">
              Showing {visibleProducts.length} of {products.length} products
            </p>

            <div className="pm-grid">
              {visibleProducts.map((product) => {
                const stock = Number(product.quantity);

                return (
                  <div key={product._id} className="pm-card">
                    <div className="pm-card-img">
                      <img src={product.image} alt={product.title} />

                      <span className="pm-badge category">
                        {product.category}
                      </span>

                      {stock < 1 && (
                        <span className="pm-badge out">Out of stock</span>
                      )}

                      {stock >= 1 && stock <= 5 && (
                        <span className="pm-badge low">Only {stock} left</span>
                      )}
                    </div>

                    <div className="pm-card-body">
                      <h2 className="pm-card-title">{product.title}</h2>

                      <p className="pm-card-company">{product.company}</p>

                      <p className="pm-card-desc">{product.description}</p>

                      <h3 className="pm-card-price">
                        Rs. {Number(product.price).toLocaleString("en-PK")}
                      </h3>

                      <div className="pm-card-meta">
                        <span>Stock: {product.quantity}</span>

                        <button
                          type="button"
                          onClick={() => navigate(`/seller/${product.sellerId}`)}
                          className="pm-link"
                        >
                          Seller profile and reviews
                        </button>
                      </div>

                      <div className="pm-card-actions">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={stock < 1}
                          className="pm-btn outline"
                        >
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                        <button
                          onClick={() => openOrder(product)}
                          disabled={stock < 1}
                          className="pm-btn solid"
                        >
                          {stock < 1 ? "Out of Stock" : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {cartOpen && (
        <div
          className="pm-overlay drawer pm-fade"
          onClick={() => setCartOpen(false)}
        >
          <section
            aria-label="Shopping cart"
            className="pm-drawer pm-slide"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pm-drawer-head">
              <div>
                <h2 className="pm-drawer-title">Your Cart</h2>
                <p className="pm-drawer-sub">{cart.length} products</p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="pm-icon-btn"
              >
                <X size={19} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="pm-cart-empty">
                <ShoppingCart size={30} />
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="pm-cart-list">
                  {cart.map((item) => (
                    <div key={item.productId} className="pm-cart-item">
                      <img src={item.image} alt={item.title} />
                      <div className="pm-cart-info">
                        <p className="pm-cart-name">{item.title}</p>
                        <p className="pm-cart-price">Rs. {item.price.toLocaleString("en-PK")}</p>
                        <div className="pm-cart-controls">
                          <button
                            type="button"
                            onClick={() => changeCartQuantity(item.productId, -1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease ${item.title} quantity`}
                            className="pm-qty-btn"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="pm-qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeCartQuantity(item.productId, 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase ${item.title} quantity`}
                            className="pm-qty-btn"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Remove ${item.title} from cart`}
                            className="pm-remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="pm-cart-total">
                        Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pm-subtotal">
                  <span>Subtotal</span>
                  <span>Rs. {cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("en-PK")}</span>
                </div>

                {cartCheckout ? (
                  <form onSubmit={placeCartOrder}>
                    <h3 className="pm-form-title">Delivery details</h3>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Full name"
                      required
                      className="pm-input"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Phone number"
                      required
                      className="pm-input"
                    />
                    <textarea
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Delivery address"
                      required
                      rows={3}
                      className="pm-input"
                    />
                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="pm-main-btn"
                    >
                      {orderLoading ? "Placing orders..." : "Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCartCheckout(false)}
                      disabled={orderLoading}
                      className="pm-text-btn"
                    >
                      Back to cart
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCartCheckout(true)}
                    className="pm-main-btn"
                    style={{ marginTop: 20 }}
                  >
                    Continue to Checkout
                  </button>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {selectedProduct && (
        <div
          className="pm-overlay center pm-fade"
          onClick={closeOrder}
        >
          <div
            className="pm-modal pm-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pm-modal-head">
              <h2 className="pm-modal-title">Place Your Order</h2>

              <button
                type="button"
                onClick={closeOrder}
                disabled={orderLoading}
                className="pm-icon-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={PlaceOrder} className="pm-modal-body">
              <div className="pm-summary">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                />

                <div>
                  <h3>{selectedProduct.title}</h3>

                  <p>{selectedProduct.company}</p>

                  <p className="price">
                    Rs. {Number(selectedProduct.price).toLocaleString("en-PK")}
                  </p>
                </div>
              </div>

              <label className="pm-label">Your Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="pm-input"
              />

              <label className="pm-label">Phone Number</label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XXXXXXXXX"
                required
                className="pm-input"
              />

              <label className="pm-label">Delivery Address</label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete address"
                required
                rows={3}
                className="pm-input"
              />

              <label className="pm-label">
                Quantity ({selectedProduct.quantity} in stock)
              </label>

              <div className="pm-qty-row">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={Number(quantity) <= 1}
                >
                  <Minus size={15} />
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
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={Number(quantity) >= Number(selectedProduct.quantity)}
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="pm-total">
                <span>Total Amount</span>

                <strong>
                  Rs. {(
                    Number(selectedProduct.price) * Number(quantity || 0)
                  ).toLocaleString("en-PK")}
                </strong>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="pm-main-btn"
                style={{ marginTop: 0 }}
              >
                {orderLoading ? "Placing Order..." : "Confirm Order"}
              </button>

              <button
                type="button"
                onClick={closeOrder}
                disabled={orderLoading}
                className="pm-cancel-btn"
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