import { MapPin, Navigation, Phone } from "lucide-react";
import type { NearbyService } from "@/types";

interface NearbyServicesProps {
  services: NearbyService[];
}

export function NearbyServices({ services }: NearbyServicesProps) {
  if (services.length === 0) {
    return <p className="humangrid-ai-empty-text">Share your location to see nearby service suggestions.</p>;
  }

  const hasMockData = services.some((service) => service.dataSource === "mock");

  return (
    <div className="humangrid-ai-nearby">
      {hasMockData && (
        <div className="humangrid-ai-mock-warning">
          <MapPin size={14} />
          <span>These are demo suggestions. Verify the provider before traveling.</span>
        </div>
      )}
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <div className="humangrid-ai-nearby-copy">
              <strong>{service.name}</strong>
              <span>{service.distanceKm} km away · {service.availability}</span>
            </div>
            <div className="humangrid-ai-nearby-actions">
              <a href={`tel:${service.contact.replace(/\s+/g, "")}`} aria-label={`Call ${service.name}`}><Phone size={14} /></a>
              {service.lat !== undefined && service.lng !== undefined && (
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`} target="_blank" rel="noreferrer" aria-label={`Navigate to ${service.name}`}><Navigation size={14} /></a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}