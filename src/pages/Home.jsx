import React, { useEffect, useState } from 'react';
import { getServices, getOffers, getLookbook } from '../services/api';
import { Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/bg2.jpg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Home = () => {
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, offersData, lookbookData] = await Promise.all([
          getServices(),
          getOffers(),
          getLookbook()
        ]);
        setServices(servicesData);
        setOffers(offersData);
        setLookbooks(lookbookData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-24 bg-cover bg-center bg-fixed relative">
      <img src={bgImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-pink-400/30 pointer-events-none"></div>
      {/* Hero Header */}
      <div className="bg-transparent rounded-b-[40px] pt-6 pb-8 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col mb-8 text-center sm:text-left drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-200 via-white to-pink-100 tracking-tighter leading-[0.8] mb-0 display-playfair hero-text-glow">
              RUK'S
            </h1>
            <h2 className="text-5xl md:text-6xl text-white leading-[0.8] tracking-wide mt-1 font-normal display-playfair hero-text-glow">
              Glow House
            </h2>
            <p className="text-2xl md:text-3xl text-pink-50 mt-3 self-end pr-4 md:pr-8 script-great-vibes hero-script-glow">
              "Glow from head to toe"
            </p>
            <button onClick={() => setShowQuiz(true)} className="mt-6 mx-auto sm:mx-0 w-max bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-bold py-2.5 px-6 rounded-full flex items-center shadow-lg transition-all active:scale-95 group">
              <span className="mr-2">✨</span> Take the Beauty Quiz <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
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

      {/* Before & After Lookbook */}
      {lookbooks.length > 0 && (
        <div className="mt-8 mb-4 px-5">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center font-serif soft-pink-shadow">
            <span className="bg-white/20 text-white p-1.5 rounded-lg mr-2 backdrop-blur-sm">📸</span>
            Real Results Lookbook
          </h3>
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar">
            {lookbooks.map((item) => (
              <div key={item.id} className="min-w-[280px] snap-center bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="flex h-36">
                  <div className="w-1/2 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-xs">Before</div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10">Before</div>
                    {item.beforeImage && <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover relative z-0" />}
                  </div>
                  <div className="w-1/2 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] relative border-l-2 border-white/30">
                    <div className="absolute inset-0 flex items-center justify-center text-white/90 font-medium text-xs">After ✨</div>
                    <div className="absolute top-2 right-2 bg-white text-[#FF1493] font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">After</div>
                    {item.afterImage && <img src={item.afterImage} alt="After" className="w-full h-full object-cover relative z-0" />}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-pink-100">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pb-6 mt-2 relative">
        {/* Services Section */}
        <div className="flex justify-between items-center mb-5 mt-6">
          <h2 className="text-xl font-bold text-white font-serif soft-pink-shadow">Our Services</h2>
          <button onClick={() => navigate('/book')} className="text-white/80 text-xs tracking-widest uppercase hover:text-white transition-colors">See All →</button>
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
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-white/70 text-lg heart-glow">♡</div>
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-pink-100">
                <span className="text-pink-400 text-sm">✦</span>
              </div> */}
              <div className="absolute -bottom-2 right-4 z-10 text-white/60 text-xs heart-glow">♡</div>
              <div className="absolute top-1/4 -left-1 z-10 text-white/50 text-[10px]">✧</div>
              <div className="absolute bottom-1/4 -right-1 z-10 text-white/50 text-[10px]">✧</div>

              <div className="grid grid-cols-2 gap-[6px] bg-white/10 backdrop-blur-sm rounded-[28px] p-[6px] border border-white/20 shadow-[0_8px_32px_rgba(255,105,180,0.15)]">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    onClick={() => navigate('/book')}
                    className={`relative cursor-pointer group overflow-hidden ${index % 3 === 0 ? 'rounded-tl-[22px]' : ''
                      } ${index % 3 === 1 ? 'rounded-tr-[22px]' : ''
                      } rounded-[16px] ${index % 4 < 2 ? 'h-[180px]' : 'h-[160px]'}`}
                  >
                    <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
                      <h3 className="text-white font-semibold text-[12px] leading-tight drop-shadow-md">
                        {service.name}
                        {service.isPackage && <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/80 text-white uppercase tracking-wider align-middle">Combo</span>}
                      </h3>
                      <div className="flex items-center mt-1 gap-1">
                        <Clock className="w-2.5 h-2.5 text-pink-200" />
                        <span className="text-pink-100 text-[10px] font-medium">{service.duration}</span>
                        {service.price && <span className="text-white text-[10px] font-bold ml-1 bg-black/30 px-1 rounded">₹{service.price}</span>}
                      </div>
                    </div>

                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-pink-400/0 group-hover:bg-pink-400/15 transition-all duration-300"></div>

                    <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm text-pink-500 text-[9px] font-bold px-2 py-1 rounded-full shadow-md">
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

      {/* Smart Beauty Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowQuiz(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FF69B4] to-[#FF1493] p-6 text-white relative">
              <button onClick={() => setShowQuiz(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-1">✨ Beauty Match</h3>
              <p className="text-sm text-pink-100">Find your perfect glow-up service</p>
            </div>
            
            <div className="p-6">
              {quizStep === 0 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 text-lg">What's your primary skin/hair goal today?</h4>
                  <div className="space-y-3">
                    {['Glowing Skin', 'Relaxation & Detox', 'Hair Transformation', 'Special Event Ready'].map(option => (
                      <button 
                        key={option}
                        onClick={() => { setQuizAnswers({...quizAnswers, goal: option}); setQuizStep(1); }}
                        className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#FF69B4] hover:bg-pink-50 transition-all font-medium text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 1 && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <h4 className="font-bold text-gray-800 mb-4 text-lg">How much time do you have?</h4>
                  <div className="space-y-3">
                    {['Quick fix (Under 30 mins)', 'A bit of pampering (1 hr)', 'Take all day! (2+ hrs)'].map(option => (
                      <button 
                        key={option}
                        onClick={() => { setQuizAnswers({...quizAnswers, time: option}); setQuizStep(2); }}
                        className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#FF69B4] hover:bg-pink-50 transition-all font-medium text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="animate-in zoom-in-95 duration-500 text-center py-4">
                  <div className="w-16 h-16 bg-pink-100 text-[#FF69B4] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✨
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2 text-xl">We found your match!</h4>
                  <p className="text-sm text-gray-500 mb-6">Based on your answers, we recommend checking out our Combos and specialized treatments.</p>
                  <button 
                    onClick={() => navigate('/book')}
                    className="w-full py-3 rounded-full font-bold bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
