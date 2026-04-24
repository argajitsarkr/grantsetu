"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { API_URL } from "@/lib/constants";

interface OrderPayload {
  order_id: string;
  amount_paise: number;
  currency: string;
  key_id: string;
  receipt: string;
  prefill: { name: string; email: string };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (err: unknown) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayCheckoutProps {
  token: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export default function RazorpayCheckout({ token, onSuccess, onError }: RazorpayCheckoutProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async () => {
    if (!window.Razorpay) {
      onError?.("Razorpay failed to load. Refresh and try again.");
      return;
    }
    setLoading(true);
    try {
      const orderRes = await fetch(`${API_URL}/api/v1/billing/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!orderRes.ok) {
        const detail = await orderRes.json().catch(() => ({ detail: "Failed to create order" }));
        onError?.(detail.detail || `Failed (${orderRes.status})`);
        setLoading(false);
        return;
      }
      const order: OrderPayload = await orderRes.json();

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount_paise,
        currency: order.currency,
        name: "GrantSetu",
        description: "GrantSetu Pro — 1 year",
        image: "/grantsetu-logo.png",
        order_id: order.order_id,
        prefill: order.prefill,
        notes: { receipt: order.receipt },
        theme: { color: "#E9283D" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/v1/billing/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            });
            if (!verifyRes.ok) {
              const detail = await verifyRes.json().catch(() => ({ detail: "Verification failed" }));
              onError?.(detail.detail || "Payment verification failed");
              return;
            }
            onSuccess();
          } catch (err) {
            onError?.(err instanceof Error ? err.message : "Verification failed");
          }
        },
        modal: {
          ondismiss: async () => {
            setLoading(false);
            try {
              await fetch(`${API_URL}/api/v1/billing/payment-failed`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: order.order_id,
                  error_code: "dismissed",
                  error_description: "User closed checkout",
                }),
              });
            } catch {
              // best-effort logging, not fatal
            }
          },
        },
      });
      rzp.on("payment.failed", async (err: unknown) => {
        const info = (err as { error?: { code?: string; description?: string } })?.error ?? {};
        try {
          await fetch(`${API_URL}/api/v1/billing/payment-failed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: order.order_id,
              error_code: info.code ?? "unknown",
              error_description: info.description ?? "Payment failed",
            }),
          });
        } catch {
          // best-effort
        }
        onError?.(info.description ?? "Payment failed");
      });
      rzp.open();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }, [token, onSuccess, onError]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <button
        type="button"
        onClick={startCheckout}
        disabled={!scriptReady || loading}
        className="inline-flex items-center justify-center bg-white text-[#E9283D] px-10 py-4 rounded-lg font-bold text-[14px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {loading ? "Opening checkout…" : !scriptReady ? "Loading…" : "Upgrade to Pro →"}
      </button>
    </>
  );
}
