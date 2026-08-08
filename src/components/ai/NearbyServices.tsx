import { Navigation, Phone } from 'lucide-react';
import type { NearbyService } from '@/types';

export function NearbyServices({ services }: { services: NearbyService[] }) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-ink-400">
        Share your location to see nearby services.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-ink-50 bg-white/70 px-4 py-3 transition-colors hover:border-gold/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-800">{service.name}</p>
            <p className="text-xs text-ink-400">
              {service.distanceKm} km away &middot; {service.availability}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={`tel:${service.contact.replace(/\s+/g, '')}`}
              aria-label={`Call ${service.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-white transition-transform hover:scale-105 active:scale-95"
            >
              <Phone size={14} />
            </a>
            {service.lat && service.lng && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Navigate to ${service.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink-800 transition-transform hover:scale-105 active:scale-95"
              >
                <Navigation size={14} />
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
