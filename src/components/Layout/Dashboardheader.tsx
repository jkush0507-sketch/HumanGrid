import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, MapPin } from 'lucide-react';
import logo from '../../assets/logo/humangrid-logo.png';
import SOSButton from '../SOSButton';

interface DashboardHeaderProps {
  notificationCount?: number;
}

const DashboardHeader = ({ notificationCount = 0 }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Fetching location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('Agra, Uttar Pradesh'),
        () => setLocation('Location unavailable')
      );
    }
  }, []);

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src={logo} alt="HumanGrid Logo" className="w-10 h-10" />
            <span className="font-playfair text-2xl font-semibold">HumanGrid</span>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm">{location}</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs rounded-full flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Your existing SOS button, with its own modal logic */}
            <SOSButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;