'use client';
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { openAuthModal, loading } = useAuth();

  if (loading) return <div className="flex justify-center item-center p-10">讀取中...</div>;
  
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <button onClick={ openAuthModal }>使用者登入</button>
        <p>Homepage</p>
      </main>
    </div>
  );
}
