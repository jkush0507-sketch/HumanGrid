import DashboardHeader from '../components/Layout/DashboardHeader';
import { Building2, Shield, Droplet } from 'lucide-react';
import { findNearby } from '../utils/findNearby';

const services = [
  {
    label: 'Hospitals',
    query: 'hospital',
    icon: <Building2 className="w-8 h-8" />,
    color: 'border-red-500',
    description: 'Find nearest hospitals and emergency care centers',
  },
  {
    label: 'Police Stations',
    query: 'police station',
    icon: <Shield className="w-8 h-8" />,
    color: 'border-blue-500',
    description: 'Locate nearby police stations for immediate help',
  },
  {
    label: 'Blood Banks',
    query: 'blood bank',
    icon: <Droplet className="w-8 h-8" />,
    color: 'border-pink-500',
    description: 'Find blood banks and donation centers near you',
  },
];

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-2">
          Nearby Services
        </h1>
        <p className="text-gray-600 mb-8 sm:mb-10">
          Tap a service to open nearby locations on Google Maps
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <button
              key={service.query}
              onClick={() => findNearby(service.query)}
              className={`group bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${service.color} text-left`}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary transition-transform group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2 text-primary group-hover:text-accent transition-colors">
                {service.label}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Map;