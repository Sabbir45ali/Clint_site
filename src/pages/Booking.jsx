import React, { useState, useEffect } from 'react';
import { getServices, bookAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

export const Booking = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices();
      setServices(data);
    };
    fetchServices();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0 || !date || !time) return;

    setLoading(true);
    try {
      await bookAppointment({
        userId: currentUser?.uid || 'guest',
        userEmail: currentUser?.email,
        serviceId: selectedServices.map(s => s.id).join(','),
        serviceName: selectedServices.map(s => s.name).join(' + '),
        date,
        time,
        status: 'Confirmed'
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

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
        <form onSubmit={handleBooking} className="space-y-6">

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 ml-1">Select Service</label>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => {
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
                  </div>
                );
              })}
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
          <div className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border-2 border-transparent hover:border-pink-50 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-pink-50 rounded-bl-full flex items-start justify-end p-3 transform group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-pink-300" />
            </div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((t) => (
                <div
                  key={t}
                  onClick={() => setTime(t)}
                  className={`border rounded-xl py-2 px-1 text-center cursor-pointer transition-all transform active:scale-95 ${time === t
                    ? 'bg-[#FF69B4] text-white border-transparent font-medium shadow-md shadow-pink-200'
                    : 'bg-gray-50 border-white text-gray-600 hover:bg-pink-50 hover:border-pink-100 text-sm'
                    }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={selectedServices.length === 0 || !date || !time || loading}
            className="w-full bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-0.5"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};
