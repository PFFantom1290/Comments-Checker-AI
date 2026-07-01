"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useT } from "@/components/I18nProvider";
import { fmt } from "@/lib/i18n";

export interface PublicPlan {
  id: string;
  name: string;
  scans: number;
  priceCents: number;
  priceId: string;
  tag?: string;
}

const price = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function ChoosePlan({
  plans,
  email,
  clientToken,
  environment,
  currentPlanId,
}: {
  plans: PublicPlan[];
  email: string;
  clientToken: string;
  environment: "sandbox" | "production";
  /** The user's active plan (if any) — highlights the card. */
  currentPlanId: string | null;
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

  function subscribe(p: PublicPlan) {
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
    // Opens Paddle's overlay for a RECURRING subscription (the price id is a
    // monthly one). Paddle handles renewal billing; we listen for
    // subscription.updated to reset the counter each cycle.
    paddle.Checkout.open({
      items: [{ priceId: p.priceId, quantity: 1 }],
      customer: { email },
      customData: { email, planId: p.id },
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {plans.map((p) => {
          const isCurrent = currentPlanId === p.id;
          return (
            <div
              key={p.id}
              className={`lift relative rounded-2xl p-5 flex flex-col backdrop-blur-sm border ${
                isCurrent
                  ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-900/30"
                  : "bg-gray-900/60 border-gray-700/70"
              }`}
            >
              {(p.tag || isCurrent) && (
                <span
                  className={`absolute -top-2.5 right-4 text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${
                    isCurrent ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
                  }`}
                >
                  {isCurrent ? t.billing.currentPlan : p.tag}
                </span>
              )}
              <p className="text-white font-semibold text-lg">{p.name}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">{p.scans}</span>
                <span className="text-gray-400 text-sm">{t.billing.scansPerMonth}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-indigo-300">{price(p.priceCents)}</span>
                <span className="text-gray-500 text-xs">{t.billing.perMonth}</span>
              </div>
              <p className="text-gray-600 text-[11px] mt-1">
                {fmt(t.billing.perScan, { c: (p.priceCents / p.scans).toFixed(1) })}
              </p>
              <button
                onClick={() => subscribe(p)}
                disabled={loading !== null || isCurrent}
                className={`mt-4 font-semibold rounded-xl px-4 py-2.5 transition-colors ${
                  isCurrent
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white"
                }`}
              >
                {isCurrent
                  ? t.billing.currentPlan
                  : loading === p.id
                  ? t.billing.opening
                  : t.billing.subscribe}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
