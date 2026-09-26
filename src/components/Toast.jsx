import React, { useState, useEffect } from "react";

/**
 * Global helper to trigger a toast notification from anywhere in the app
 * @param {string} message - Message to display
 * @param {"success" | "error" | "warning" | "info"} type - Toast style
 * @param {number} duration - Duration in milliseconds (default 3500)
 */
export function showToast(message, type = "success", duration = 3500) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("travelGurujiToast", {
        detail: { id: Date.now() + Math.random(), message, type, duration },
      })
    );
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleToast(e) {
      if (!e.detail || !e.detail.message) return;
      const newToast = e.detail;

      setToasts((prev) => {
        if (prev.some((t) => t.message === newToast.message)) {
          return prev;
        }
        return [...prev, newToast];
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 3500);
    }

    window.addEventListener("travelGurujiToast", handleToast);
    return () => window.removeEventListener("travelGurujiToast", handleToast);
  }, []);

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div className="tg-toast-container" aria-live="assertive" role="region">
      {toasts.map((toast) => {
        const icon =
          toast.type === "success"
            ? "✓"
            : toast.type === "error"
            ? "✕"
            : toast.type === "warning"
            ? "🔒"
            : "ℹ";

        return (
          <div key={toast.id} className={`tg-toast-item tg-toast-${toast.type}`}>
            <span className="tg-toast-icon">{icon}</span>
            <span className="tg-toast-message">{toast.message}</span>
            <button
              type="button"
              className="tg-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
