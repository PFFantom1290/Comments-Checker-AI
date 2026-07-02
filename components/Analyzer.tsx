"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/lib/analyzer";
import { useT } from "@/components/I18nProvider";
import { fmt } from "@/lib/i18n";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";

type AppState = "idle" | "loading" | "result" | "error";

export default function Analyzer({
  initialRemaining,
  unlimited = false,
}: {
  initialRemaining: number;
  unlimited?: boolean;
}) {
  const t = useT();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);
  const inputRef = useRef<HTMLInputElement>(null);

  const outOfScans = !unlimited && remaining <= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || outOfScans) return;

    setState("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const left = res.headers.get("X-Scans-Remaining");
      if (!unlimited && left !== null && left !== "unlimited") {
        setRemaining(Number(left));
      }

      const text = await res.text();
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          res.ok
            ? "We received an unexpected response. Please try again."
            : `Something went wrong on our side (error ${res.status}). Please try again in a moment.`
        );
      }

      if (!res.ok) {
        throw new Error((data.error as string) ?? "Something went wrong.");
      }
      setResult(data as unknown as AnalysisResult);
      setState("result");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error.");
      setState("error");
    }
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    setUrl("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <>
      {/* Scan counter */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-center gap-3">
        {unlimited ? (
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border bg-indigo-900/30 border-indigo-700/50 text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            {t.analyzer.unlimited}
          </span>
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border ${
                outOfScans
                  ? "bg-red-900/30 border-red-700/50 text-red-300"
                  : "bg-gray-900 border-gray-700 text-gray-300"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${outOfScans ? "bg-red-400" : "bg-emerald-400"}`} />
              {outOfScans ? t.analyzer.noScans : fmt(t.analyzer.scansLeft, { n: remaining })}
            </span>
            <Link href="/billing" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
              {t.analyzer.buyMore}
            </Link>
          </>
        )}
      </div>

      {/* Input form — one prominent bar with the action inside */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-10">
        <div
          className={`flex items-center gap-2 rounded-2xl border bg-gray-900/80 p-2 pl-4 transition
            border-gray-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/40
            ${state === "loading" || outOfScans ? "opacity-60" : "shadow-lg shadow-indigo-950/30"}`}
        >
          <svg
            className="w-5 h-5 shrink-0 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.com/dp/..."
            aria-label="Product URL"
            required
            disabled={state === "loading" || outOfScans}
            className="flex-1 min-w-0 bg-transparent py-3 text-gray-100 placeholder-gray-600 focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={state === "loading" || !url.trim() || outOfScans}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 sm:px-7 py-3 transition-colors whitespace-nowrap"
          >
            {state === "loading" ? t.analyzer.analyzing : t.analyzer.analyze}
          </button>
        </div>
      </form>

      {/* Out of scans */}
      {outOfScans && state !== "result" && (
        <div className="w-full max-w-2xl bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 text-center">
          <p className="text-gray-200 font-medium mb-1">{t.analyzer.outTitle}</p>
          <p className="text-gray-500 text-sm mb-4">{t.analyzer.outBody}</p>
          <Link
            href="/billing"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors"
          >
            {t.analyzer.buyScans}
          </Link>
        </div>
      )}

      {/* States */}
      {state === "loading" && (
        <div className="flex flex-col items-center gap-4 mt-8 text-gray-400">
          <LoadingSpinner />
          <p className="text-sm animate-pulse">{t.analyzer.loading}</p>
        </div>
      )}

      {state === "error" && (
        <div className="w-full max-w-2xl bg-red-950/50 border border-red-800/60 rounded-2xl p-6 text-center">
          <p className="text-red-300 font-medium mb-1">{t.analyzer.errorTitle}</p>
          <p className="text-red-400/80 text-sm">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="mt-4 text-sm underline text-red-300 hover:text-red-200"
          >
            {t.analyzer.tryAnother}
          </button>
        </div>
      )}

      {state === "result" && result && (
        <div className="w-full max-w-2xl animate-fade-up">
          <ResultCard result={result} onReset={handleReset} />
        </div>
      )}

    </>
  );
}
