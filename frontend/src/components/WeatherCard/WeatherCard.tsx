import { Droplet, Wind } from 'lucide-react';
import { WeatherData } from '../../types/weather.types';
import { getWeatherIconUrl } from '../../utils/getWeatherIconUrl';
import { StatCard } from '../StatCard/StatCard';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-6 rounded-lg bg-black/55 p-6 text-white shadow-lg backdrop-blur-sm md:p-8">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-medium">{data.city}</h2>
          <img
            src={getWeatherIconUrl(data.icon)}
            alt={data.condition}
            className="-ml-2 h-20 w-20"
          />
          <p className="text-lg capitalize">{data.condition}</p>
        </div>

        <p className="shrink-0 text-6xl font-bold">{data.temperature}&nbsp;°C</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Droplet className="h-5 w-5" aria-hidden="true" />}
          label="Humidity"
          value={`${data.humidity} %`}
        />
        <StatCard
          icon={<Wind className="h-5 w-5" aria-hidden="true" />}
          label="Wind Speed"
          value={`${data.windSpeed} km/h`}
        />
      </div>
    </div>
  );
}
