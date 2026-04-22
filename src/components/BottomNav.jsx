import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarHeart, User } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-red-50 rounded-t-3xl shadow-[0_-10px_20px_-1px_rgba(255,105,180,0.1)] md:hidden">
      <div className="grid h-full w-full grid-cols-3 mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `inline-flex flex-col items-center justify-center px-5 hover:bg-pink-50 transition-colors rounded-tl-3xl ${isActive ? 'text-[#FF69B4]' : 'text-gray-400'}`
          }
          end
        >
          <Home className="w-5 h-5 mb-1" strokeWidth={2.5} />
          <span className="text-[10px] font-semibold">Home</span>
        </NavLink>
        <NavLink
          to="/book"
          className={({ isActive }) =>
            `inline-flex flex-col items-center justify-center px-5 hover:bg-pink-50 transition-colors ${isActive ? 'text-[#FF69B4]' : 'text-gray-400'}`
          }
        >
          <CalendarHeart className="w-5 h-5 mb-1" strokeWidth={2.5} />
          <span className="text-[10px] font-semibold">Book</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `inline-flex flex-col items-center justify-center px-5 hover:bg-pink-50 transition-colors rounded-tr-3xl ${isActive ? 'text-[#FF69B4]' : 'text-gray-400'}`
          }
        >
          <User className="w-5 h-5 mb-1" strokeWidth={2.5} />
          <span className="text-[10px] font-semibold">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
