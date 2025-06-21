

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="copyright">
            &copy; {new Date().getFullYear()} <span className="brand">Admin Panel</span>. All Rights Reserved.
          </p>
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <span className="divider">|</span>
            <Link href="/contact" className="footer-link">Contact Us</Link>
          </div>
        </div>
        <div className="footer-right">
          <div className="version">v2.1.0</div>
        </div>
      </div>
    </footer>
  );
}