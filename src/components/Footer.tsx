import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-gold" />
              <span className="font-playfair text-2xl font-bold">HumanGrid</span>
            </div>
            <p className="text-blue-200 text-sm">
              Emergency assistance platform connecting people with immediate help and nearby services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-blue-200 hover:text-gold transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ai" className="text-blue-200 hover:text-gold transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/sos" className="text-blue-200 hover:text-gold transition-colors">
                  SOS
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>Hospital Assistance</li>
              <li>Blood Bank</li>
              <li>Police Help</li>
              <li>Ambulance</li>
              <li>Shelter Support</li>
              <li>Food Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1" />
                <span>support@humangrid.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1" />
                <span>+91 112 (Emergency)</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; 2026 HumanGrid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;