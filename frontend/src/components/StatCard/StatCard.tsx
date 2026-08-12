import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-black/55 p-4 text-white shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-sm capitalize text-white/80">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
