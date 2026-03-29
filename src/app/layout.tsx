import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_QLD_Hand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import NavBar from "../components/nav/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const QLDHand = Edu_QLD_Hand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-QLD-hand",
});

export const metadata: Metadata = {
  title: "Collife",
  description: "Interactive Web-based Digital Diary",
};

import Footer from "../components/ui/Footer";

// ... (中間保持不變)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Betania+Patmos+GDL&family=Bitcount+Grid+Double+Ink:wght@100..900&family=Covered+By+Your+Grace&family=Dancing+Script:wght@400..700&family=Edu+NSW+ACT+Cursive:wght@400..700&family=Give+You+Glory&family=Gochi+Hand&family=Handjet:wght,ELSH@100..900,2&family=Handlee&family=Homemade+Apple&family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Italianno&family=Just+Another+Hand&family=Kranky&family=Permanent+Marker&family=Playwrite+DK+Uloopet+Guides&family=Reenie+Beanie&family=Roboto:ital,wght@0,100..900;1,100..900&family=Zen+Loop:ital@0;1&family=Zeyada&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${QLDHand.className} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
