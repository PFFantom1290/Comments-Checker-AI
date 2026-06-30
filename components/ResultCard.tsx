"use client";

import type { AnalysisResult, Aspect } from "@/lib/analyzer";
import { useT } from "@/components/I18nProvider";
import { fmt } from "@/lib/i18n";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const VERDICT_CONFIG = {
  BUY: { bg: "bg-emerald-950/60", border: "border-emerald-700/50", badge: "bg-emerald-500 text-white", bar: "bg-emerald-500", icon: "✓" },
  DONT_BUY: { bg: "bg-red-950/60", border: "border-red-700/50", badge: "bg-red-500 text-white", bar: "bg-red-500", icon: "✗" },
  MIXED: { bg: "bg-yellow-950/60", border: "border-yellow-700/50", badge: "bg-yellow-500 text-black", bar: "bg-yellow-500", icon: "~" },
};

const RISK_CONFIG = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-700/40",
  medium: "bg-yellow-500/15 text-yellow-300 border-yellow-700/40",
  high: "bg-red-500/15 text-red-300 border-red-700/40",
};

const ASPECT_ICON = {
  positive: { icon: "✓", cls: "text-emerald-400" },
  negative: { icon: "✗", cls: "text-red-400" },
  mixed: { icon: "~", cls: "text-yellow-400" },
};

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="text-amber-400 tracking-tight" aria-hidden>
      {"★".repeat(rounded)}
      <span className="text-gray-700">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

export default function ResultCard({ result, onReset }: Props) {
  const t = useT();
  const verdict = result.verdict in VERDICT_CONFIG ? result.verdict : "MIXED";
  const cfg = VERDICT_CONFIG[verdict];

  const pros = result.pros ?? [];
  const cons = result.cons ?? [];
  const aspects: Aspect[] = result.aspects ?? [];
  const bestFor = result.bestFor ?? [];
  const watchOuts = result.watchOuts ?? [];
  const sentiment = result.sentiment ?? { positive: 0, neutral: 0, negative: 0 };
  const sentTotal = sentiment.positive + sentiment.neutral + sentiment.negative;
  const riskKey = result.fakeReviewRisk ?? "low";

  const verdictLabel =
    verdict === "BUY" ? t.result.buy : verdict === "DONT_BUY" ? t.result.dontBuy : t.result.mixed;
  const riskLabel =
    riskKey === "high" ? t.result.riskHigh : riskKey === "medium" ? t.result.riskMedium : t.result.riskLow;

  const pct = (n: number) => (sentTotal > 0 ? Math.round((n / sentTotal) * 100) : 0);

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 sm:p-8 space-y-6 backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t.result.product}</p>
          <h2 className="text-white font-semibold text-lg leading-snug line-clamp-2">{result.productTitle}</h2>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <span className={`${cfg.badge} text-sm font-black rounded-xl px-4 py-2 tracking-wider`}>
            {cfg.icon} {verdictLabel}
          </span>
          <span className="text-gray-500 text-xs mt-1">{fmt(t.result.confidence, { n: result.confidence })}</span>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2.5 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{t.result.estRating}</p>
          {result.ratingEstimate != null ? (
            <>
              <p className="text-white font-semibold text-sm leading-tight">
                {result.ratingEstimate.toFixed(1)}<span className="text-gray-500">/5</span>
              </p>
              <div className="text-xs mt-0.5"><Stars rating={result.ratingEstimate} /></div>
            </>
          ) : (
            <p className="text-gray-600 text-sm">—</p>
          )}
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2.5 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{t.result.reviewsRead}</p>
          <p className="text-white font-semibold text-sm">
            {result.reviewCount ? `~${result.reviewCount.toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2.5 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{t.result.fakeRisk}</p>
          <span className={`inline-block text-xs font-semibold border rounded-full px-2 py-0.5 ${RISK_CONFIG[riskKey]}`}>
            {riskLabel}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      {/* Sentiment breakdown */}
      {sentTotal > 0 && (
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{t.result.sentiment}</p>
          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-gray-800">
            <div className="bg-emerald-500 h-full" style={{ width: `${pct(sentiment.positive)}%` }} />
            <div className="bg-gray-500 h-full" style={{ width: `${pct(sentiment.neutral)}%` }} />
            <div className="bg-red-500 h-full" style={{ width: `${pct(sentiment.negative)}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-emerald-400">{pct(sentiment.positive)}% {t.result.positive}</span>
            <span className="text-gray-400">{pct(sentiment.neutral)}% {t.result.neutral}</span>
            <span className="text-red-400">{pct(sentiment.negative)}% {t.result.negative}</span>
          </div>
        </div>
      )}

      {/* Bottom line */}
      {result.bottomLine && (
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4">
          <p className="text-indigo-300 text-xs uppercase tracking-widest mb-2">{t.result.bottomLine}</p>
          <p className="text-gray-200 leading-relaxed text-sm">{result.bottomLine}</p>
        </div>
      )}

      {/* Pros / Cons */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-emerald-950/40 border border-emerald-900/40 rounded-xl p-4">
          <p className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-1.5">
            <span className="text-emerald-500">+</span> {t.result.love}
          </p>
          {pros.length === 0 ? (
            <p className="text-gray-600 text-sm italic">{t.result.none}</p>
          ) : (
            <ul className="space-y-2">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-red-950/40 border border-red-900/40 rounded-xl p-4">
          <p className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-1.5">
            <span className="text-red-500">−</span> {t.result.complaints}
          </p>
          {cons.length === 0 ? (
            <p className="text-gray-600 text-sm italic">{t.result.none}</p>
          ) : (
            <ul className="space-y-2">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Aspect breakdown */}
      {aspects.length > 0 && (
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">{t.result.details}</p>
          <ul className="space-y-2.5">
            {aspects.map((a, i) => {
              const ai = ASPECT_ICON[a.sentiment] ?? ASPECT_ICON.mixed;
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={`${ai.cls} mt-0.5 shrink-0 font-bold`}>{ai.icon}</span>
                  <span className="text-gray-300">
                    <span className="text-gray-100 font-medium">{a.name}</span>
                    {a.detail ? <span className="text-gray-400"> — {a.detail}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Best for / Watch outs */}
      {(bestFor.length > 0 || watchOuts.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {bestFor.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{t.result.bestFor}</p>
              <div className="flex flex-wrap gap-2">
                {bestFor.map((b, i) => (
                  <span key={i} className="bg-gray-800/70 border border-gray-700 text-gray-300 text-xs rounded-full px-3 py-1">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
          {watchOuts.length > 0 && (
            <div>
              <p className="text-amber-400/80 text-xs uppercase tracking-widest mb-2">⚠ {t.result.watchOut}</p>
              <ul className="space-y-1.5">
                {watchOuts.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Summary + authenticity */}
      <div className="space-y-3 pt-1">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{t.result.summary}</p>
          <p className="text-gray-300 leading-relaxed text-sm">{result.summary}</p>
        </div>
        {result.fakeReviewReason && (
          <p className="text-gray-500 text-xs leading-relaxed">
            <span className="text-gray-400">{t.result.authenticity}:</span> {result.fakeReviewReason}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <p className="text-gray-600 text-xs">Powered by Jina AI Reader + GPT-4o mini</p>
        <button onClick={onReset} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          ← {t.result.analyzeAnother}
        </button>
      </div>
    </div>
  );
}
