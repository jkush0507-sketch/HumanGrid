import { Link } from 'react-router-dom';
import { Building2, Droplet, Shield, Ambulance, Home, Utensils, Heart, Baby } from 'lucide-react';

interface EmergencyCardProps {
  title: string;
  description: string;
  type: string;
  color: string;
  isLoading?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  hospital: <Building2 className="w-8 h-8" />,
  blood_bank: <Droplet className="w-8 h-8" />,
  police: <Shield className="w-8 h-8" />,
  ambulance: <Ambulance className="w-8 h-8" />,
  shelter: <Home className="w-8 h-8" />,
  food: <Utensils className="w-8 h-8" />,
  women_safety: <Heart className="w-8 h-8" />,
  child_safety: <Baby className="w-8 h-8" />,
};

const EmergencyCard = ({ title, description, type, color, isLoading = false }: EmergencyCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <Link
      to={`/chat?service=${type}`}
      className={`group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${color}`}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
        <div className="text-primary">{iconMap[type]}</div>
      </div>
      <h3 className="font-playfair text-xl font-semibold mb-2 text-primary group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
};

export default EmergencyCard;