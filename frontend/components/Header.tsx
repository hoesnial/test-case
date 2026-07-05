'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  hideSearch?: boolean;
}

export const Header = ({ hideSearch = false }: HeaderProps) => {
  const { getItemCount } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-[60px] flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-gray-900 whitespace-nowrap flex-shrink-0">
          <span className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center text-white text-[15px]">
            M
          </span>
          MiniShop
        </Link>

        {/* Search Bar */}
        {!hideSearch && (
          <div className="flex-1 min-w-[200px] flex items-center border-2 border-emerald-600 rounded-md overflow-hidden">
            <select className="border-none px-2.5 text-[13px] bg-white text-slate-600 h-10 outline-none border-r border-gray-200 cursor-pointer w-[100px]">
              <option>Semua</option>
              <option>Elektronik</option>
              <option>Pakaian</option>
              <option>Rumah</option>
              <option>Olahraga</option>
            </select>
            <input
              type="search"
              placeholder="Cari produk impianmu..."
              aria-label="Search"
              className="flex-1 border-none px-3.5 text-[13px] h-10 outline-none"
            />
            <button className="w-[42px] h-10 bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Spacer - push actions to right when search is hidden */}
        {hideSearch && <div className="flex-1" />}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {!isAuthenticated ? (
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-900 text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              <span>Sign In Account</span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-900 text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:bg-gray-50 hover:border-gray-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <span>Hi, {user?.username}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <Link href="/cart" className="relative text-slate-600 hover:text-emerald-600 transition-colors duration-150">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 01-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 text-[9px] rounded-full bg-red-600 text-white flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
