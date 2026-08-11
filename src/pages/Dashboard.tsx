import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Layout/Dashboardheader';
import EmergencyCard from '../components/Emergency/EmergencyCard';

const emergencyCards = [
  { title: 'Hospital Assistance', description: 'Find nearest hospitals and emergency care', type: 'hospital', color: 'border-red-500' },
  { title: 'Blood Bank', description: 'Locate blood banks and donation centers', type: 'blood_bank', color: 'border-pink-500' },
  { title: 'Police Help', description: 'Contact police for immediate assistance', type: 'police', color: 'border-blue-500' },
  { title: 'Ambulance', description: 'Request emergency ambulance services', type: 'ambulance', color: 'border-orange-500' },
  { title: 'Shelter', description: 'Find emergency shelter and housing', type: 'shelter', color: 'border-green-500' },
  { title: 'Food Support', description: 'Access food banks and meal services', type: 'food', color: 'border-yellow-500' },
  { title: 'Women Safety', description: 'Specialized support for women in crisis', type: 'women_safety', color: 'border-purple-500' },
  { title: 'Child Safety', description: 'Child protection and emergency services', type: 'child_safety', color: 'border-indigo-500' },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader notificationCount={3} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-12">
          <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
            {getGreeting()}, Jatin.
          </h1>
          <p className="text-xl text-gray-600">How can HumanGrid help you today?</p>
        </section>

        {/* Emergency Cards */}
        <section className="mb-12">
          <h2 className="font-playfair text-2xl font-semibold text-primary mb-6">
            Emergency Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <EmergencyCard key={i} {...emergencyCards[0]} isLoading />
                ))
              : emergencyCards.map((card, index) => (
                  <EmergencyCard key={index} {...card} />
                ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-primary rounded-2xl p-8 text-white">
          <h2 className="font-playfair text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/map')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">View Map</p>
              <p className="text-sm text-gray-300">Find nearby services</p>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">Chat Assistant</p>
              <p className="text-sm text-gray-300">AI-powered help</p>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
            >
              <p className="font-semibold">Profile</p>
              <p className="text-sm text-gray-300">View your info</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;