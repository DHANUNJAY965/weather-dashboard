import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      className="flex w-full flex-col items-center gap-2 rounded-lg border border-red-400/30 bg-red-950/60 p-8 text-center text-white shadow-lg backdrop-blur-sm"
      role="alert"
    >
      <AlertTriangle className="h-8 w-8 text-red-200" aria-hidden="true" />
      <p className="text-red-100">{message}</p>
    </div>
  );
}
