import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookings, getLoyaltyPoints } from '../services/api';
import { LogOut, Star, CalendarDays, Award, Edit2, Check, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [points, setPoints] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit forms state
  const [editData, setEditData] = useState({
    displayName: currentUser?.displayName || '',
    age: currentUser?.age || '',
    gender: currentUser?.gender || '',
    photoURL: currentUser?.photoURL || ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userBookings = await getBookings(currentUser.uid || 'guest');
        setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const userPoints = await getLoyaltyPoints(currentUser.uid || 'guest');
        setPoints(userPoints);

        setEditData({
          displayName: currentUser.displayName || '',
          age: currentUser.age || '',
          gender: currentUser.gender || '',
          photoURL: currentUser.photoURL || ''
        });
      }
    };
    fetchData();
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile(editData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      <div className="bg-gradient-to-b from-white to-[#FFF0F5] rounded-b-[40px] pt-12 pb-10 px-6 shadow-sm border-b border-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#FF69B4] to-pink-300 rounded-full flex items-center justify-center p-1 mb-4 shadow-lg shadow-pink-200 transform hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl overflow-hidden border-2 border-white">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif font-bold text-[#FF69B4]">
                    {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="absolute bottom-4 -right-2 bg-white text-[#FF69B4] p-1.5 rounded-full shadow-md border border-pink-100 transition-transform active:scale-95">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full max-w-xs space-y-3 bg-white/80 p-5 rounded-3xl shadow-sm border border-pink-50 backdrop-blur-sm mt-2 animate-in fade-in zoom-in duration-200">
              <div>
                <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Profile Image</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Camera className="h-3.5 w-3.5 text-pink-300" />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs pl-8 pr-3 py-2 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 cursor-pointer" />
                </div>
                {editData.photoURL && <div className="mt-2 ml-1 text-xs text-green-600 font-semibold">Image primed & ready!</div>}
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Full Name</label>
                <input type="text" value={editData.displayName} onChange={e => setEditData({ ...editData, displayName: e.target.value })} className="w-full text-sm px-3.5 py-2.5 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Age</label>
                  <input type="number" value={editData.age} onChange={e => setEditData({ ...editData, age: e.target.value })} className="w-full text-sm px-3.5 py-2.5 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Gender</label>
                  <select value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })} className="w-full text-sm px-3.5 py-2.5 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button onClick={() => setIsEditing(false)} className="flex-1 text-xs py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-50 flex justify-center items-center active:scale-95 transition-transform">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </button>
                <button disabled={saving} onClick={handleSaveProfile} className="flex-1 text-xs py-2.5 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white font-medium shadow-md shadow-pink-200 flex justify-center items-center hover:opacity-90 active:scale-95 transition-all">
                  {saving ? 'Saving...' : <><Check className="w-4 h-4 mr-1" /> Save</>}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-serif text-gray-800">{currentUser?.displayName || 'Beautiful User'}</h1>
              <p className="text-gray-500 text-sm font-medium">{currentUser?.email || 'user@example.com'}</p>

              {(currentUser?.age || currentUser?.gender) && (
                <div className="flex gap-2 mt-2.5 mb-1 justify-center animate-in fade-in zoom-in duration-300">
                  {currentUser.age && <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 px-3 py-1 rounded-full font-semibold">{currentUser.age} yrs</span>}
                  {currentUser.gender && <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 px-3 py-1 rounded-full font-semibold">{currentUser.gender}</span>}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-6 flex items-center text-xs font-semibold text-gray-500 bg-white px-5 py-2.5 rounded-full shadow-sm hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20">
        {/* Loyalty Card */}
        <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-[28px] p-6 shadow-xl shadow-gray-300/30 text-white mb-8 border border-gray-700 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Award className="w-32 h-32" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-700 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="flex justify-between items-center mb-5 relative z-10">
            <h3 className="font-semibold text-sm flex items-center text-gray-200">
              <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400" />
              Loyalty Points
            </h3>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase shadow-sm">Gold Tier</span>
          </div>
          <p className="text-5xl font-bold tracking-tight mb-2 relative z-10 font-serif">{points}</p>
          <p className="text-xs text-gray-400 relative z-10 font-medium tracking-wide flex items-center">
            Earn 10 points for every booking!
          </p>
        </div>

        {/* Booking History */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 font-serif flex items-center pl-1">
            <CalendarDays className="w-5 h-5 mr-2 text-[#FF69B4]" />
            Booking History
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-[24px] p-8 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-pink-50">
              <div className="w-16 h-16 bg-pink-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-pink-400" />
              </div>
              <p className="font-semibold text-gray-700 mb-1">No bookings yet</p>
              <p className="text-xs text-gray-500">Your upcoming spa days will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between hover:border-pink-100 transition-colors group">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-[13px] mb-1.5">{booking.serviceName}</h4>
                    <p className="text-[11px] text-gray-500 flex items-center">
                      <span className="font-semibold text-[#FF69B4] bg-pink-50 px-2 py-0.5 rounded-md mr-2">{booking.date}</span>
                      <span className="font-medium">{booking.time}</span>
                    </p>
                  </div>
                  <div className="bg-green-50 text-green-600 text-[9px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-green-100">
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
