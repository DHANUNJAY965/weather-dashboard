import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div
      className="flex w-full flex-col items-center gap-3 rounded-lg bg-black/55 p-8 text-white shadow-lg backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      <p className="text-white/80">Fetching weather...</p>
    </div>
  );
}
