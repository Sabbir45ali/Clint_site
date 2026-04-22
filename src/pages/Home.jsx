import React, { useEffect, useState } from 'react';
import { getServices } from '../services/api';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Hero Header */}
      <div className="bg-white rounded-b-[40px] shadow-sm pt-12 pb-8 px-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif text-gray-800 mb-2">
            Ruksana's Parlour
          </h1>
          <p className="text-gray-500 text-sm mb-6">Discover your beauty potential with our premium services.</p>

          <div className="relative h-44 rounded-3xl overflow-hidden shadow-lg shadow-pink-100 group">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bfc17484d20?q=80&w=800&auto=format&fit=crop"
              alt="Salon interior"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold text-xl mb-1">Special Offer</p>
              <p className="text-xs opacity-90 inline-block bg-pink-500 px-2 py-1 rounded-full">Get 20% off your first booking!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-800 font-serif">Our Services</h2>
        </div>

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate('/book')}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(255,105,180,0.2)] transition-all duration-300 cursor-pointer group flex flex-col transform hover:-translate-y-1"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h3 className="font-semibold text-gray-800 text-[13px] leading-tight mb-2">{service.name}</h3>
                  <div className="flex items-center text-pink-500 text-xs font-medium bg-pink-50 self-start px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
