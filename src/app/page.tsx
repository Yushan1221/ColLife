'use client';

import { useAuth } from "../hooks/useAuth";
import LoadingPage from "@/src/components/loading/LoadingPage";
import HeroSection from "@/src/components/home/HeroSection";

export default function HomePage() {
  const { loading: authLoading } = useAuth();

  if (authLoading) return <LoadingPage />;
  
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <HeroSection />
    </div>
  );
}
