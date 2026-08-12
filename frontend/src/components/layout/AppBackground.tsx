import { ReactNode } from 'react';
import { BACKGROUND_IMAGES } from '../../constants/weather';
import { BackgroundVariant } from '../../utils/getBackgroundVariant';

interface AppBackgroundProps {
  variant: BackgroundVariant;
  children: ReactNode;
}

export function AppBackground({ variant, children }: AppBackgroundProps) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-12 transition-[background-image] duration-700"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGES[variant]})` }}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div className="relative flex w-full max-w-2xl flex-col gap-6">{children}</div>
    </div>
  );
}
