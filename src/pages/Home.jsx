import React, { useEffect, useState } from 'react';
import { getServices, getOffers } from '../services/api';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/bg2.jpg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Home = () => {
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [servicesData, offersData] = await Promise.all([
        getServices(),
        getOffers()
      ]);
      setServices(servicesData);
      setOffers(offersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen pb-24 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-pink-400/30 pointer-events-none"></div>
      {/* Hero Header */}
      <div className="bg-transparent rounded-b-[40px] pt-6 pb-8 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col mb-8 mt-2">
            <h1 className="text-5xl md:text-6xl text-white leading-[0.8] tracking-widest font-normal" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 15px rgba(255, 105, 180, 0.8), 0 0 30px rgba(255, 105, 180, 0.4)' }}>
              RUK'S
            </h1>
            <h2 className="text-5xl md:text-6xl text-white leading-[0.8] tracking-wide mt-1 font-normal" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 15px rgba(255, 105, 180, 0.8), 0 0 30px rgba(255, 105, 180, 0.4)' }}>
              Glow House
            </h2>
            <p className="text-2xl md:text-3xl text-pink-50 mt-3 self-end pr-4 md:pr-8" style={{ fontFamily: "'Great Vibes', cursive", textShadow: '0 0 10px rgba(255, 105, 180, 0.6)' }}>
              "Glow from head to toe"
            </p>
          </div>

          {/* Offers Section */}
          <SkeletonTheme baseColor="#f9d5e5" highlightColor="#fff0f5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton height={144} borderRadius={24} />
              </div>
            ) : offers.length > 0 ? (
              <div className="space-y-3">
                {offers.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="relative h-36 rounded-3xl overflow-hidden group">
                    {offer.image ? (
                      <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-pink-400 to-pink-600"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-semibold text-lg mb-1">{offer.title}</p>
                      <p className="text-xs opacity-90 inline-block bg-pink-500 px-2 py-1 rounded-full">{offer.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative h-36 rounded-3xl overflow-hidden bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="font-semibold text-xl mb-1">Welcome!</p>
                  <p className="text-xs opacity-90 inline-block bg-pink-700/50 px-3 py-1 rounded-full">Book your first glow-up session today</p>
                </div>
              </div>
            )}
          </SkeletonTheme>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-5 pb-6 mt-2 relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white font-serif" style={{ textShadow: '0 2px 10px rgba(255, 105, 180, 0.8)' }}>Our Services</h2>
          <span className="text-white/60 text-xs tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Explore</span>
        </div>

        <SkeletonTheme baseColor="#f9d5e5" highlightColor="#fff0f5">
          {loading ? (
            <div className="grid grid-cols-2 gap-[6px] bg-white/10 backdrop-blur-sm rounded-[28px] p-[6px] border border-white/20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-[16px] overflow-hidden">
                  <Skeleton height={i % 2 === 0 ? 180 : 160} borderRadius={16} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-white/70 text-lg" style={{ textShadow: '0 0 8px rgba(255,105,180,0.6)' }}>♡</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-pink-100">
                <span className="text-pink-400 text-sm">✦</span>
              </div>
              <div className="absolute -bottom-2 right-4 z-10 text-white/60 text-xs" style={{ textShadow: '0 0 8px rgba(255,105,180,0.6)' }}>♡</div>
              <div className="absolute top-1/4 -left-1 z-10 text-white/50 text-[10px]">✧</div>
              <div className="absolute bottom-1/4 -right-1 z-10 text-white/50 text-[10px]">✧</div>

              <div className="grid grid-cols-2 gap-[6px] bg-white/10 backdrop-blur-sm rounded-[28px] p-[6px] border border-white/20 shadow-[0_8px_32px_rgba(255,105,180,0.15)]">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    onClick={() => navigate('/book')}
                    className={`relative cursor-pointer group overflow-hidden ${index % 3 === 0 ? 'rounded-tl-[22px]' : ''
                      } ${index % 3 === 1 ? 'rounded-tr-[22px]' : ''
                      } rounded-[16px]`}
                    style={{
                      height: index % 4 < 2 ? '180px' : '160px',
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
                      <h3 className="text-white font-semibold text-[12px] leading-tight drop-shadow-md" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {service.name}
                      </h3>
                      <div className="flex items-center mt-1 gap-1">
                        <Clock className="w-2.5 h-2.5 text-pink-200" />
                        <span className="text-pink-100 text-[10px] font-medium">{service.duration}</span>
                      </div>
                    </div>

                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-pink-400/0 group-hover:bg-pink-400/15 transition-all duration-300"></div>

                    <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm text-pink-500 text-[9px] font-bold px-2 py-1 rounded-full shadow-md" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Book →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SkeletonTheme>
      </div>
    </div>
  );
};
