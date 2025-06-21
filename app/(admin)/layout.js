
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider, useAdminContext } from "@/context/AdminContext";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/AdminFooter";
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

import "./globals.css";

function ProtectedLayout({ children }) {
  const { admin, loading, authChecked } = useAdminContext();
  const pathname = usePathname();
  const router = useRouter();

  // Check if current route is a protected admin route (excluding /admin)
  const isProtectedRoute = pathname.startsWith("/admin") && pathname !== "/admin";

  useEffect(() => {
    if (!authChecked) return;
    
    if (isProtectedRoute && !admin) {
      router.push("/admin");
    }
  }, [admin, authChecked, isProtectedRoute, router]);

  if (!authChecked || (isProtectedRoute && !admin)) {
    return null;
  }

  const shouldShowLayout = isProtectedRoute;

  return shouldShowLayout ? (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <main className="admin-content">{children}</main>
        <Footer />
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}

function BubbleBackground() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate bubbles only on client side
    const generatedBubbles = Array.from({ length: 10 }, () => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <>
      {bubbles.map((bubble, i) => (
        <div 
          key={i}
          className="bubble"
          style={{
            width: `${bubble.width}px`,
            height: `${bubble.height}px`,
            left: `${bubble.left}vw`,
            top: `${bubble.top}vh`,
            animationDelay: `${bubble.delay}s`
          }}
        />
      ))}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Admin Panel</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#2c3e50',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }
          }} 
        />
        <AdminProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AdminProvider>
        
        <BubbleBackground />
      </body>
    </html>
  );
}