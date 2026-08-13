import { Building2, Shield, Droplet, Siren, Home, Soup, HeartHandshake, User } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Hospital Assistance",
    description: "Find nearest hospitals and emergency medical care",
    color: "border-red-500",
  },
  {
    icon: Droplet,
    title: "Blood Bank",
    description: "Locate blood banks and donation centers",
    color: "border-pink-500",
  },
  {
    icon: Shield,
    title: "Police Help",
    description: "Contact police for immediate assistance",
    color: "border-blue-500",
  },
  {
    icon: Siren,
    title: "Ambulance",
    description: "Request emergency ambulance services",
    color: "border-orange-500",
  },
  {
    icon: Home,
    title: "Shelter",
    description: "Find emergency shelter and housing",
    color: "border-green-500",
  },
  {
    icon: Soup,
    title: "Food Support",
    description: "Access food banks and meal services",
    color: "border-yellow-500",
  },
  {
    icon: HeartHandshake,
    title: "Women Safety",
    description: "Specialized support for women in crisis",
    color: "border-purple-500",
  },
  {
    icon: User,
    title: "Child Safety",
    description: "Child protection and emergency services",
    color: "border-indigo-500",
  },
];

const Features = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            Emergency Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quick access to essential emergency services when you need them most
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${feature.color}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;