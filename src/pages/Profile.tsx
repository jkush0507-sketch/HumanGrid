import { User, Phone, Droplet, MapPin, History, Edit2 } from 'lucide-react';
import DashboardHeader from '../components/Layout/DashboardHeader';

const emergencyContacts = [
  { name: 'Father', relation: 'Emergency Contact', phone: '+91 98765 43210' },
  { name: 'Mother', relation: 'Emergency Contact', phone: '+91 98765 11111' },
];

const emergencyHistory = [
  { category: 'Medical Emergency', date: 'Aug 5, 2026', status: 'completed' },
  { category: 'Ambulance Request', date: 'Jul 28, 2026', status: 'completed' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  dispatched: 'bg-blue-100 text-blue-800',
};

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-1">
                Jatin
              </h1>
              <p className="text-gray-600">jatin@example.com</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start sm:self-auto">
              <Edit2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contact + Medical info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-base sm:text-lg">Contact Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">+91 98765 43210</p>
              </div>
              <div className="flex items-start space-x-1">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">Agra, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Droplet className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-base sm:text-lg">Medical Information</h2>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">O+</p>
            </div>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="font-semibold text-base sm:text-lg mb-4">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0 gap-2 sm:gap-0"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.relation}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-primary hover:underline text-sm sm:text-base"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency history */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base sm:text-lg">Emergency History</h2>
          </div>
          {emergencyHistory.length > 0 ? (
            <div className="space-y-3">
              {emergencyHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0 gap-2 sm:gap-0"
                >
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No emergency history</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;