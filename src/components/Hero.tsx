import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-900 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Emergency Help When You Need It Most
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              HumanGrid connects you with immediate emergency assistance, nearby services, and AI-powered guidance during critical situations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-gold text-primary font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Get Help Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/ai"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                AI Assistant
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full"></div>
              <img
                src="/humangrid-logo.png"
                alt="HumanGrid Emergency Services"
                className="relative z-10 w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;