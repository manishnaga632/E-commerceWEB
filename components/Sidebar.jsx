


"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Profile", path: "/admin/profile" },
  { name: "Users", path: "/admin/users" },
  { name: "Category", path: "/admin/category" },
  { name: "Products", path: "/admin/product" },
  { name: "Promocode", path: "/admin/promocode" },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`sidebar-link ${pathname === item.path ? "active" : ""}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
