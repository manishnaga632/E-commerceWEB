// app/layout.js or app/(frontend)/layout.js
import './globals.css';
import { StateContext } from "@/context/StateContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"; // ✅ corrected

export const metadata = {
  title: "Dine Market",
  description: "Your fashion destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <UserProvider>
          <StateContext>
            <WishlistProvider>
              <div className="layout">
                <header className="sticky top-0 z-50 bg-white shadow-sm">
                  <Navbar />
                </header>
                <main className="flex-grow">
                  {children}
                </main>
                <footer>
                  <Footer />
                </footer>
                <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Correct toast */}
              </div>
            </WishlistProvider>
          </StateContext>
        </UserProvider>
      </body>
    </html>
  );
}
