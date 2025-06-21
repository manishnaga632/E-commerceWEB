


"use client";

import React from "react";
import Link from "next/link";
import { useAdminContext } from "@/context/AdminContext";

export default function AdminHeader() {
  const { admin, logout } = useAdminContext();

  return (
    <header className="header">
      <div className="header-title">Admin Dashboard</div>
      <div className="header-user">
        {admin ? (
          <div className="profile-dropdown">
            <span className="dropdown-toggle">
              Welcome, {admin.name}
            </span>
            <div className="dropdown-menu">
              <Link href="/admin/profile">Profile</Link>
              <Link href="/admin/update_password">Update Password</Link>
              {/* <Link href="/admin/subscribe">Subscribe</Link> */}
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </header>
  );
}
