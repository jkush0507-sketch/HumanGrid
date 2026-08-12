import { MapPin, Navigation, Phone } from "lucide-react";
import type { NearbyService } from "@/types";

interface NearbyServicesProps {
  services: NearbyService[];
}

export function NearbyServices({
  services,
}: NearbyServicesProps) {
  if (services.length === 0) {
    return (
      <p className="text-sm text-ink-400">
        Share your location to see nearby service suggestions.
      </p>
    );
  }

  const containsMockData = services.some(
    (service) => service.dataSource === "mock"
  );

  return (
    <div>
      {containsMockData && (
        <div className="mb-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span>
            These are demo suggestions around your location. Verify the
            provider before traveling.
          </span>
        </div>
      )}

      <ul className="space-y-2.5">
        {services.map((service) => (
          <li
            key={service.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink-50 bg-white/70 px-4 py-3 transition-colors hover:border-gold/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-800">
                {service.name}
              </p>

              <p className="text-xs text-ink-400">
                {service.distanceKm} km away · {service.availability}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <a
                href={`tel:${service.contact.replace(/\s+/g, "")}`}
                aria-label={`Call ${service.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <Phone size={14} />
              </a>

              {service.lat !== undefined &&
                service.lng !== undefined && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Navigate to ${service.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink-800 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ink-700"
                  >
                    <Navigation size={14} />
                  </a>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}