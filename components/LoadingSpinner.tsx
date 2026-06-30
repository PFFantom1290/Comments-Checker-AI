export default function LoadingSpinner() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-indigo-900" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" />
    </div>
  );
}
