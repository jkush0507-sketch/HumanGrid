import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Phone, MapPin, X } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { sendSOS } from "@/services/sos";

const SOS = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emergencyNumbers = [
    { label: "National Emergency", number: "112" },
    { label: "Police", number: "100" },
    { label: "Ambulance", number: "108" },
    { label: "Women Helpline", number: "1091" },
    { label: "Child Helpline", number: "1098" },
  ];

  const handleSendSOS = async () => {
    if (!user) {
      setError("You must be logged in to send SOS.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await sendSOS("general_emergency", "active");
      setSent(true);
    } catch {
      setError("Unable to send SOS. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-playfair text-xl font-bold">Emergency SOS</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close SOS"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-800 mb-1">
                Emergency Only
              </h2>
              <p className="text-sm text-red-700">
                Use SOS only in genuine emergencies. False reports may have legal consequences.
              </p>
            </div>
          </div>
        </div>

        {/* SOS Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-gray-600 mb-6">
            Tap below to send an emergency alert to HumanGrid responders.
          </p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ SOS alert sent successfully. Help is on the way.
              </p>
            </div>
          ) : (
            <button
              onClick={handleSendSOS}
              disabled={isSending}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
            >
              {isSending ? "Sending..." : "SEND SOS"}
            </button>
          )}

          {error && (
            <p className="text-red-600 mt-4 text-sm">{error}</p>
          )}
        </div>

        {/* Emergency Numbers */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-primary" />
            <span>Emergency Contacts</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{item.label}</span>
                <span className="text-primary font-bold">{item.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Location Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                Share Your Location
              </h4>
              <p className="text-sm text-blue-700">
                For faster help, enable location access in your browser and share your location with emergency contacts.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SOS;