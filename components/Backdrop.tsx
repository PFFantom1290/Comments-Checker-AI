// Decorative, non-interactive background: a faint grid + slow-drifting aurora
// glows, fading into the dark base. Sits behind all content.
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-70" />
      <div
        className="aurora-blob"
        style={{
          width: 540,
          height: 540,
          top: -180,
          left: -140,
          background: "radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: 480,
          height: 480,
          top: -90,
          right: -130,
          animationDelay: "-8s",
          background: "radial-gradient(circle, rgba(168,85,247,0.40), transparent 70%)",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: 460,
          height: 460,
          bottom: -200,
          left: "32%",
          animationDelay: "-15s",
          background: "radial-gradient(circle, rgba(16,185,129,0.26), transparent 70%)",
        }}
      />
      {/* Fade everything into the base color toward the bottom. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/30 to-gray-950" />
    </div>
  );
}
