import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookings, getLoyaltyPoints, getLoyaltySettings, updateBookingStatus, rescheduleAppointment, getAvailableSlots, submitReview, getUserProfile, updateUserProfileData } from '../services/api';
import { LogOut, Star, CalendarDays, Award, Edit2, Check, X, Camera, Phone, Info, ChevronRight, Clock, MessageSquareHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import profileBg from '../assets/images/Profile_bg.jpg';

export const Profile = () => {
  const { currentUser, logout, updateUserProfile, linkPhone, setupRecaptcha } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [points, setPoints] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [loyaltySettings, setLoyaltySettings] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Review System State
  const [reviewData, setReviewData] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Phone link state
  const [linkPhoneState, setLinkPhoneState] = useState('');
  const [linkOtp, setLinkOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Edit forms state
  const [editData, setEditData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    age: currentUser?.age || '',
    gender: currentUser?.gender || '',
    photoURL: currentUser?.photoURL || ''
  });



  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const [userBookings, userPoints, settings, profile] = await Promise.all([
          getBookings(currentUser.uid || 'guest'),
          getLoyaltyPoints(currentUser.uid || 'guest'),
          getLoyaltySettings(),
          getUserProfile()
        ]);

        if (settings?.tiers?.platinum) {
          delete settings.tiers.platinum;
        }

        setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setPoints(userPoints);
        setLoyaltySettings(settings);

        setEditData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: profile?.phone || '',
          age: profile?.age || '',
          gender: profile?.gender || '',
          photoURL: currentUser.photoURL || profile?.photoURL || ''
        });
        setDataLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const getCurrentTierInfo = () => {
    if (!loyaltySettings?.tiers) return { current: { name: 'Member', maxPoints: 100 }, progress: 0, pointsToNext: 100 };
    const tiers = Object.values(loyaltySettings.tiers).sort((a, b) => a.maxPoints - b.maxPoints);
    let current = tiers[0];
    let nextTier = tiers[1] || current;
    let prevMax = 0;

    for (let i = 0; i < tiers.length; i++) {
      if (points < tiers[i].maxPoints || i === tiers.length - 1) {
        current = tiers[i];
        nextTier = tiers[i + 1] || current;
        break;
      }
      prevMax = tiers[i].maxPoints;
    }

    const pointsInCurrentTier = Math.max(0, points - prevMax);
    const tierRange = current.maxPoints === Infinity ? 1 : (current.maxPoints - prevMax);
    const progress = current.maxPoints === Infinity ? 100 : Math.min(100, (pointsInCurrentTier / tierRange) * 100);

    return {
      current,
      nextTier,
      progress,
      pointsToNext: current.maxPoints === Infinity ? 0 : current.maxPoints - points
    };
  };

  useEffect(() => {
    let active = true;
    if (rescheduleData && rescheduleDate) {
      setSlotsLoading(true);
      setRescheduleTime('');
      getAvailableSlots(rescheduleDate).then(slots => {
        if (active) {
          setAvailableSlots(slots);
          setSlotsLoading(false);
        }
      });
    } else {
      setAvailableSlots([]);
    }
    return () => { active = false; };
  }, [rescheduleDate, rescheduleData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      const userBookings = await getBookings(currentUser.uid || 'guest');
      setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    }
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) return;
    setSaving(true);
    try {
      await rescheduleAppointment(rescheduleData.id, rescheduleDate, rescheduleTime);
      setRescheduleData(null);
      const userBookings = await getBookings(currentUser.uid || 'guest');
      setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewData) return;
    setSaving(true);
    try {
      await submitReview(reviewData.id, reviewRating, reviewComment);
      setReviewData(null);
      setReviewRating(5);
      setReviewComment('');
      // Refresh to hide the "Leave review" button
      const userBookings = await getBookings(currentUser.uid || 'guest');
      setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to submit review", err);
    }
    setSaving(false);
  };

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
    setProfileError('');
    setProfileSuccess('');
    const normalizedPhone = String(editData.phone || '').replace(/[\s()-]/g, '').trim();
    if (!normalizedPhone) {
      setProfileError('Phone number is required for booking.');
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      setProfileError('Enter a valid phone number (10-15 digits, optional +).');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(editData);
      await updateUserProfileData({ ...editData, phone: normalizedPhone });
      setIsEditing(false);
      setEditData((prev) => ({ ...prev, phone: normalizedPhone }));
      setProfileSuccess('Profile saved. Phone is ready for booking.');
    } catch (err) {
      console.error("Failed to update profile", err);
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] bg-cover bg-center bg-fixed pb-24 relative">
      <img src={profileBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#230818]/35 via-[#360c24]/25 to-[#190612]/45 pointer-events-none"></div>
      <div className="pt-12 pb-6 px-6 relative">
        <div className="hidden absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

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
              <div>
                <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Email</label>
                <input type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} className="w-full text-sm px-3.5 py-2.5 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 text-left font-semibold uppercase tracking-wider mb-1 px-1">Phone (Required for booking)</label>
                <input type="tel" required value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="+911234567890" className="w-full text-sm px-3.5 py-2.5 bg-white/60 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none transition-all" />
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
              {profileError && <p className="text-xs text-red-500 font-medium">{profileError}</p>}
              {profileSuccess && <p className="text-xs text-green-600 font-medium">{profileSuccess}</p>}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-serif text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">{currentUser?.displayName || 'Beautiful User'}</h1>
              <p className="text-pink-50 text-sm font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">{currentUser?.email || 'user@example.com'}</p>
              {!!editData.phone && <p className="text-white/90 text-xs font-medium mt-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">{editData.phone}</p>}

              {(currentUser?.age || currentUser?.gender) && (
                <div className="flex gap-2 mt-2.5 mb-1 justify-center animate-in fade-in zoom-in duration-300">
                  {currentUser.age && <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 px-3 py-1 rounded-full font-semibold">{currentUser.age} yrs</span>}
                  {currentUser.gender && <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 px-3 py-1 rounded-full font-semibold">{currentUser.gender}</span>}
                </div>
              )}

              {/* currentUser?.phoneNumber ? (
                <div className="flex items-center mt-2 justify-center text-xs text-gray-500 font-medium bg-white/40 border border-pink-100 px-3 py-1.5 rounded-full shadow-sm max-w-[fit-content] mx-auto">
                  <Phone className="w-3.5 h-3.5 mr-1 text-pink-500" />
                  {currentUser.phoneNumber}
                  <Check className="w-3.5 h-3.5 ml-1 text-green-500" />
                </div>
              ) : (
                <div className="mt-3 w-full max-w-xs bg-white/40 p-3 rounded-xl border border-pink-100 mx-auto text-left shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Link Phone Number</h4>
                  {linkError && <p className="text-[10px] text-red-500 mb-1">{linkError}</p>}
                  {linkSuccess && <p className="text-[10px] text-green-600 mb-1">{linkSuccess}</p>}

                  <div id="recaptcha-container-profile" className="mb-2"></div>

                  {!otpSent ? (
                    <div className="flex gap-2">
                      <input type="tel" value={linkPhoneState} onChange={e => setLinkPhoneState(e.target.value)} placeholder="+1234567890" className="flex-1 text-xs px-2.5 py-1.5 bg-white/60 border border-pink-100 rounded-lg outline-none focus:border-pink-300" />
                      <button onClick={async () => {
                        try {
                          setLinkError('');
                          const verifier = setupRecaptcha('recaptcha-container-profile');
                          const confirmation = await linkPhone(linkPhoneState, verifier);
                          setConfirmationResult(confirmation);
                          setOtpSent(true);
                        } catch (err) {
                          setLinkError('Failed to send OTP.');
                        }
                      }} className="bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white text-[10px] px-3 rounded-lg font-bold shadow-sm active:scale-95 transition-transform">Send</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={linkOtp} onChange={e => setLinkOtp(e.target.value)} placeholder="123456" className="flex-1 text-xs px-2.5 py-1.5 bg-white/60 border border-pink-100 rounded-lg outline-none focus:border-pink-300" />
                      <button onClick={async () => {
                        try {
                          setLinkError('');
                          await confirmationResult.confirm(linkOtp);
                          setLinkSuccess('Phone linked successfully!');
                          setOtpSent(false);
                        } catch (err) {
                          setLinkError('Invalid OTP.');
                        }
                      }} className="bg-green-500 text-white text-[10px] px-3 rounded-lg font-bold shadow-sm active:scale-95 transition-transform">Verify</button>
                    </div>
                  )}
                </div>
              ) */}



              <button
                onClick={handleLogout}
                className="mt-4 flex items-center text-xs font-semibold text-gray-500 bg-white px-5 py-2.5 rounded-full shadow-sm hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-6 mt-2 relative z-20">
        {/* Loyalty Card */}
        <SkeletonTheme baseColor="#374151" highlightColor="#4b5563">
          {dataLoading ? (
            <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-[28px] p-6 shadow-xl shadow-gray-300/30 mb-8 border border-gray-700">
              <div className="flex justify-between items-center mb-5">
                <Skeleton width={120} height={16} />
                <Skeleton width={70} height={22} borderRadius={8} />
              </div>
              <Skeleton width={100} height={48} className="skeleton-mb-8" />
              <Skeleton width={200} height={12} />
            </div>
          ) : (
            <div className="bg-gradient-to-tr from-[#3a0f2d] via-[#5c1f45] to-[#7a2b59] rounded-[28px] p-6 shadow-xl shadow-pink-500/30 text-white mb-8 border border-pink-300/25 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl opacity-70 -mr-10 -mt-10"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="font-semibold text-sm flex items-center text-pink-100 mb-1">
                    <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400" />
                    My Beauty Rewards
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight font-serif">{points}</p>
                    <span className="text-xs text-pink-100/80 font-medium">pts</span>
                  </div>
                </div>

                <button onClick={() => setShowTierModal(true)} className="bg-pink-950/30 hover:bg-pink-900/40 border border-pink-200/30 rounded-full p-2 transition-colors group/btn">
                  <Info className="w-4 h-4 text-pink-100/90 group-hover/btn:text-white" />
                </button>
              </div>

              {(() => {
                const tierInfo = getCurrentTierInfo();
                return (
                  <div className="relative z-10 bg-pink-950/20 rounded-2xl p-4 border border-pink-200/20 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-[10px] text-pink-100/70 font-bold uppercase tracking-wider mb-0.5">Current Tier</p>
                        <p className="text-sm font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">{tierInfo.current.name}</p>
                      </div>
                      {tierInfo.pointsToNext > 0 ? (
                        <div className="text-right">
                          <p className="text-[10px] text-pink-100/70 font-medium">Next Tier</p>
                          <p className="text-xs font-bold text-pink-50">{tierInfo.pointsToNext} pts to <span className="text-white">{tierInfo.nextTier.name}</span></p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-[10px] text-pink-100/70 font-medium">Status</p>
                          <p className="text-xs font-bold text-yellow-400">Max Tier Reached!</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2.5 w-full bg-pink-200/20 rounded-full overflow-hidden mt-3 mb-1 ring-1 ring-pink-100/20">
                      <div
                        className="h-full bg-gradient-to-r from-fuchsia-400 via-pink-300 to-amber-300 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_16px_rgba(244,114,182,0.55)]"
                        style={{ width: `${tierInfo.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </SkeletonTheme>

        {/* Info Modal */}
        {showTierModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowTierModal(false)}>
            <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="pt-8 pb-6 px-6 text-center bg-pink-50/50 relative border-b border-pink-100">
                <button onClick={() => setShowTierModal(false)} className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-400 hover:text-gray-800 shadow-sm transition-all active:scale-95">
                  <X className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-200 text-white">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-gray-800 mb-1">Beauty Rewards</h3>
                <p className="text-sm text-gray-500">Earn points on every booking to unlock exclusive salon perks.</p>
              </div>

              <div className="p-6 space-y-4">
                {loyaltySettings?.tiers && ['member', 'silver', 'gold'].map(k => loyaltySettings.tiers[k]).filter(Boolean).map((tier, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 ${idx === 0 ? 'bg-gray-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-yellow-400' : 'bg-gradient-to-r from-gray-700 to-black'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{tier.name}</h4>
                      <p className="text-[11px] font-semibold text-pink-500 mb-1 uppercase tracking-wider">{!tier.maxPoints || tier.maxPoints === Infinity ? 'Highest Tier' : `Up to ${tier.maxPoints} pts`}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{tier.perk}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Booking History */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 font-serif flex items-center pl-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            <CalendarDays className="w-5 h-5 mr-2 text-[#FF69B4]" />
            Booking History
          </h2>

          <SkeletonTheme baseColor="#f9d5e5" highlightColor="#fff0f5">
            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton width="60%" height={14} className="skeleton-mb-8" />
                      <Skeleton width="40%" height={10} />
                    </div>
                    <Skeleton width={60} height={24} borderRadius={8} />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
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
                  <div key={booking.id} className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] border border-gray-100 items-center justify-between hover:border-pink-100 transition-colors group flex flex-col md:flex-row gap-3">
                    <div className="flex-1 w-full relative">
                      <h4 className="font-semibold text-gray-800 text-[13px] mb-1.5">{booking.serviceName}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center mb-1">
                        <span className="font-semibold text-[#FF69B4] bg-pink-50 px-2 py-0.5 rounded-md mr-2">{booking.date}</span>
                        <span className="font-medium">{booking.time}</span>
                      </p>

                      <div className="absolute top-0 right-0 md:relative md:mt-2">
                        <span className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                          booking.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                              booking.status === 'Cancelled' || booking.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                booking.status.includes('pending client approval') ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                  'bg-gray-50 text-gray-600 border-gray-100'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">
                      {booking.status === 'Completed' && !booking.hasReviewed ? (
                        <button onClick={() => {
                          setReviewData(booking);
                          setReviewRating(5);
                          setReviewComment('');
                        }} className="py-1.5 px-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 mr-1 fill-white" /> Leave Review
                        </button>
                      ) : booking.status.includes('pending client approval') ? (
                        <>
                          <button onClick={() => handleStatusChange(booking.id, 'Confirmed')} className="flex-1 md:flex-none py-1.5 px-3 bg-green-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-green-600 transition-all">Accept</button>
                          <button onClick={() => handleStatusChange(booking.id, 'Cancelled')} className="flex-1 md:flex-none py-1.5 px-3 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-all">Reject</button>
                        </>
                      ) : (booking.status === 'Pending' || booking.status === 'Confirmed') ? (
                        <>
                          <button onClick={() => {
                            setRescheduleData(booking);
                            setRescheduleDate('');
                            setRescheduleTime('');
                          }} className="flex-1 md:flex-none py-1.5 px-3 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center">
                            <Clock className="w-3 h-3 mr-1" /> Re-schedule
                          </button>
                          <button onClick={() => handleStatusChange(booking.id, 'Cancelled')} className="flex-1 md:flex-none py-1.5 px-3 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-all">Cancel</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SkeletonTheme>
        </div>
      </div>

      {/* Reschedule Modal for Client */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setRescheduleData(null)}>
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-pink-50/30">
              <h3 className="text-lg font-bold font-serif text-gray-800">Request Reschedule</h3>
              <button onClick={() => setRescheduleData(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReschedule} className="p-6 space-y-5">
              <p className="text-xs text-gray-500 font-medium">Select a new date and time from our available slots.</p>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-pink-50 transition-colors">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all font-medium text-sm"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group min-h-[140px] hover:border-pink-50 transition-colors">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Time Slot</label>
                {!rescheduleDate ? (
                  <div className="text-center py-4 text-[10px] font-bold text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 uppercase tracking-widest">Select date first</div>
                ) : slotsLoading ? (
                  <div className="text-center py-4 text-xs font-bold text-pink-400 animate-pulse bg-pink-50/50 rounded-xl">Checking...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map(t => (
                      <div
                        key={t}
                        onClick={() => setRescheduleTime(t)}
                        className={`border rounded-xl py-2 text-center cursor-pointer font-semibold transition-all transform active:scale-95 text-[11px] ${rescheduleTime === t
                          ? 'bg-[#FF69B4] text-white border-transparent shadow-md shadow-pink-200 scale-105'
                          : 'bg-gray-50 border-white text-gray-600 hover:bg-pink-50 hover:border-pink-100'
                          }`}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[10px] font-bold text-red-500 bg-red-50 rounded-xl border border-dashed border-red-100 uppercase tracking-widest">Fully Booked</div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRescheduleData(null)} className="flex-1 py-3.5 rounded-xl text-xs font-bold border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !rescheduleDate || !rescheduleTime} className="flex-1 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 disabled:opacity-50 transition-all select-none actve:scale-95">
                  {saving ? 'Saving...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal for Client */}
      {reviewData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setReviewData(null)}>
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-8 border-b border-gray-100 flex flex-col items-center justify-center relative bg-gradient-to-tr from-pink-50/50 to-purple-50/50">
              <button onClick={() => setReviewData(null)} className="absolute top-4 right-4 p-1.5 hover:bg-white/50 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 bg-gradient-to-tr from-[#FF69B4] to-pink-300 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-pink-200 text-white">
                <MessageSquareHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-800 text-center">Rate your Experience</h3>
              <p className="text-xs text-gray-500 font-medium text-center mt-1">How was your {reviewData.serviceName}?</p>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 transform hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${reviewRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share a few words about your experience (optional)..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-700 outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all text-sm resize-none h-28"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={saving || !reviewRating} className="w-full py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 disabled:opacity-50 transition-all select-none actve:scale-95">
                  {saving ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
