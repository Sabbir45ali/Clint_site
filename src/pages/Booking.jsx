import React, { useState, useEffect } from 'react';
import { getServices, bookAppointment, getAvailableSlots, getUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Phone, ArrowRight, Mail } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Booking = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
      setServicesLoading(false);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      setUserPhone(profile?.phone || '');
      setProfileLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    let active = true;
    if (date) {
      setSlotsLoading(true);
      setTime(''); // Reset time when date changes
      getAvailableSlots(date).then(slots => {
        if (active) {
          setAvailableSlots(slots);
          setSlotsLoading(false);
        }
      });
    } else {
      setAvailableSlots([]);
    }
    return () => { active = false; };
  }, [date]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0 || !date || !time) return;
    if (!userPhone) {
      setProfileError('Please add your phone number in Profile before booking.');
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(String(userPhone).replace(/[\s()-]/g, '').trim())) {
      setProfileError('Phone number in Profile is invalid. Please update it.');
      return;
    }

    setLoading(true);
    setProfileError('');
    try {
      await bookAppointment({
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Client',
        userEmail: currentUser?.email,
        userPhone,
        serviceId: selectedServices.map(s => s.id).join(','),
        serviceName: selectedServices.map(s => s.name).join(' + '),
        servicePrice: selectedServices.map(s => s.price).join(' + '),
        date,
        time,
        status: 'Pending'
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  /* ── Phone-number missing banner ── */
  const PhoneMissingBanner = () => (
    <div className="mb-6 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border-2 border-dashed border-amber-200 rounded-3xl p-5 text-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-100/60 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-100/60 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-100 border border-amber-100">
          <Phone className="w-6 h-6 text-amber-500 animate-bounce" />
        </div>
        <h3 className="font-bold text-gray-800 text-sm mb-1">Phone Number Required</h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[260px] mx-auto mb-4">
          We need your phone number to confirm bookings and send appointment updates. Add it in your profile to get started!
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-95 hover:-translate-y-0.5"
        >
          Go to Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ── Phone present banner ── */
  const PhonePresentBanner = () => (
    <div className="mb-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
      <Mail className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
      <span>Booking updates will be sent to <strong>{currentUser?.email}</strong></span>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-pink-100 mb-6 transform scale-110">
          <CheckCircle2 className="w-12 h-12 text-[#FF69B4]" />
        </div>
        <h2 className="text-3xl font-bold font-serif text-gray-800 mb-2">You're Booked!</h2>
        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">Your appointment for <span className="font-semibold text-gray-700">{selectedServices.map(s => s.name).join(' & ')}</span> is confirmed for {date} at {time}.</p>
        <button
          onClick={() => {
            setSuccess(false);
            setSelectedServices([]);
            setDate('');
            setTime('');
          }}
          className="w-full max-w-xs bg-white text-[#FF69B4] border-2 border-pink-100 rounded-2xl py-3.5 font-semibold shadow-sm hover:bg-pink-50 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Book Another Service
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      <div className="bg-white rounded-b-[40px] shadow-sm pt-12 pb-8 px-6 mb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-800 mb-2">Book a Service</h1>
        <p className="text-gray-500 text-sm">Select your treatment and preferred time.</p>
      </div>

      <div className="px-6">
        {profileLoading ? (
          <div className="mb-4 text-xs text-gray-600 bg-white/80 border border-pink-100 rounded-xl px-3 py-2">
            Checking profile details...
          </div>
        ) : !userPhone ? (
          <PhoneMissingBanner />
        ) : (
          <PhonePresentBanner />
        )}
        {profileError && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {profileError}
          </div>
        )}
        <form onSubmit={handleBooking} className="space-y-6">

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 ml-1">Select Service</label>
            <div className="grid grid-cols-2 gap-3">
              <SkeletonTheme baseColor="#f9d5e5" highlightColor="#fff0f5">
                {servicesLoading ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="border-2 border-white rounded-2xl p-3 bg-white shadow-sm">
                        <Skeleton height={14} width="80%" className="skeleton-center" />
                      </div>
                    ))}
                  </>
                ) : (
                  services.map((service) => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
                          } else {
                            setSelectedServices([...selectedServices, service]);
                          }
                        }}
                        className={`border-2 rounded-2xl p-3 cursor-pointer transition-all transform active:scale-95 ${isSelected
                          ? 'border-[#FF69B4] bg-pink-50 shadow-md shadow-pink-100'
                          : 'border-white bg-white hover:border-pink-200 shadow-sm'
                          }`}
                      >
                        <p className="font-medium text-xs text-gray-800 text-center">{service.name}</p>
                        {service.price && <p className="text-[10px] text-[#FF69B4] font-semibold text-center mt-1">₹{service.price}</p>}
                      </div>
                    );
                  })
                )}
              </SkeletonTheme>
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border-2 border-transparent hover:border-pink-50 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-full flex items-start justify-end p-3 transform group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-5 h-5 text-pink-300" />
            </div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Time Selection */}
          <div className={`bg-white p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border-2 border-transparent transition-colors relative overflow-hidden group ${date ? 'hover:border-pink-50' : 'opacity-60 cursor-not-allowed'}`}>
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-full flex items-start justify-end p-3 transform group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-pink-300" />
            </div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Time Slot</label>

            {!date ? (
              <div className="text-center py-4 text-xs font-medium text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Please select a date first
              </div>
            ) : slotsLoading ? (
              <div className="text-center py-4 text-xs font-medium text-pink-400 animate-pulse bg-pink-50/50 rounded-xl">
                Checking availability...
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((t) => (
                  <div
                    key={t}
                    onClick={() => setTime(t)}
                    className={`border rounded-xl py-2 px-1 text-center cursor-pointer transition-all transform active:scale-95 ${time === t
                      ? 'bg-[#FF69B4] text-white border-transparent font-medium shadow-md shadow-pink-200 scale-105'
                      : 'bg-gray-50 border-white text-gray-600 hover:bg-pink-50 hover:border-pink-100 text-sm'
                      }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs font-medium text-red-500 bg-red-50 rounded-xl border border-dashed border-red-100">
                Fully Booked. No slots left on this date.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={selectedServices.length === 0 || !date || !time || loading || profileLoading || !userPhone}
            className="w-full bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-0.5"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};
