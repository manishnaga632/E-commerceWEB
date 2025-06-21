
'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { CgShoppingCart, CgUser, CgHeart } from "react-icons/cg";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../public/assets/Logo.png";
import { useStateContext } from "../context/StateContext";
import { useUser } from "../context/UserContext";
import { useWishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const { showCart, setShowCart, totalQty } = useStateContext();
  const { userInfo, loading, authChecked, logout } = useUser();
  const { wishlistCount } = useWishlistContext();

  const [toggleMenu, setToggleMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper flex justify-between items-center p-4 shadow-md bg-white">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} width={140} height={25} alt="logo" priority />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav Links */}
          <ul className="nav-links flex gap-6 font-medium">
            <Link href="/female"><li>Female</li></Link>
            <Link href="/male"><li>Male</li></Link>
            <Link href="/kids"><li>Kids</li></Link>
            <Link href="/products"><li>All Products</li></Link>
            {userInfo?.role === 'admin' && <Link href="/admin"><li>Manager</li></Link>}
          </ul>

          {/* Search */}
          <div className="search-bar flex items-center gap-2 border px-2 py-1 rounded-md">
            <CiSearch />
            <input type="text" placeholder="What you looking for" className="outline-none w-40" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link href="/wishlist">
              <button className="wishlist relative mx-2">
                <CgHeart size={22} />
                {userInfo && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <button className="cart relative mx-2">
                <CgShoppingCart size={22} />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalQty}
                  </span>
                )}
              </button>
            </Link>

            {/* User */}
            {!authChecked || loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : userInfo ? (
              <div className="user-info relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown absolute right-0 mt-2 bg-white border shadow-lg rounded-md w-48 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{userInfo.name || "User"}</p>
                      <p className="text-sm text-gray-600">{userInfo.email}</p>
                    </div>
                    <Link href="/profile">
                      <p className="px-4 py-2 hover:bg-gray-100">Profile</p>
                    </Link>
                    <Link href="/update-password">
                      <p className="px-4 py-2 hover:bg-gray-100">Update Password</p>
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-1 text-blue-600 font-medium hover:underline">
                  <CgUser size={22} /> <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart">
            <button className="cart relative">
              <CgShoppingCart size={22} />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQty}
                </span>
              )}
            </button>
          </Link>
          <button onClick={() => setToggleMenu(!toggleMenu)}>
            {toggleMenu ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {toggleMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40 p-4">
            <ul className="space-y-4">
              <Link href="/female"><li>Female</li></Link>
              <Link href="/male"><li>Male</li></Link>
              <Link href="/kids"><li>Kids</li></Link>
              <Link href="/products"><li>All Products</li></Link>
              {userInfo?.role === 'admin' && <Link href="/admin"><li>Manager</li></Link>}
              
              <div className="pt-4 border-t">
                {userInfo ? (
                  <>
                    <Link href="/profile"><li>Profile</li></Link>
                    <Link href="/update-password"><li>Update Password</li></Link>
                    <li onClick={handleLogoutClick} className="text-red-600">Logout</li>
                  </>
                ) : (
                  <Link href="/login"><li>Login</li></Link>
                )}
              </div>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;