"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useT } from "@/components/I18nProvider";
import { fmt } from "@/lib/i18n";

export interface PublicPackage {
  id: string;
  scans: number;
  priceCents: number;
  priceId: string;
  tag?: string;
}

const price = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function BuyScans({
  packages,
  email,
  clientToken,
  environment,
}: {
  packages: PublicPackage[];
  email: string;
  clientToken: string;
  environment: "sandbox" | "production";
}) {
  const t = useT();
  const [paddle, setPaddle] = useState<Paddle>();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientToken) return;
    initializePaddle({
      environment,
      token: clientToken,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          const txnId = (event.data as { transaction_id?: string } | undefined)?.transaction_id;
          window.location.href = txnId
            ? `/billing/success?_ptxn=${encodeURIComponent(txnId)}`
            : "/billing/success";
        }
      },
    })
      .then((p) => {
        if (p) setPaddle(p);
      })
      .catch(() => setError("Could not load the payment widget. Refresh and try again."));
  }, [clientToken, environment]);

  function buy(p: PublicPackage) {
    setError("");
    if (!clientToken || !p.priceId) {
      setError("Payments aren't fully configured yet (missing Paddle token or price id).");
      return;
    }
    if (!paddle) {
      setError("Payment widget is still loading — try again in a moment.");
      return;
    }
    setLoading(p.id);
    paddle.Checkout.open({
      items: [{ priceId: p.priceId, quantity: 1 }],
      customer: { email },
      customData: { email, packageId: p.id, scans: String(p.scans) },
    });
    setTimeout(() => setLoading(null), 1500);
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 bg-red-950/50 border border-red-800/60 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {packages.map((p) => (
          <div
            key={p.id}
            className="lift relative bg-gray-900/60 border border-gray-700/70 rounded-2xl p-5 flex flex-col backdrop-blur-sm"
          >
            {p.tag && (
              <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[11px] font-semibold rounded-full px-2.5 py-0.5">
                {p.tag}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{p.scans}</span>
              <span className="text-gray-400 text-sm">{t.billing.scans}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-indigo-300">{price(p.priceCents)}</span>
              <span className="text-gray-500 text-xs">
                {fmt(t.billing.perScan, { c: (p.priceCents / p.scans).toFixed(1) })}
              </span>
            </div>
            <button
              onClick={() => buy(p)}
              disabled={loading !== null}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-2.5 transition-colors"
            >
              {loading === p.id ? t.billing.opening : t.billing.buy}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
