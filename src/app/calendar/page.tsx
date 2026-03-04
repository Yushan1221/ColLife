'use client';
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingPage } from "@/src/components/loading/LoadingPage";

export default function CalendarPage() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 載入中顯示
  if (loading || !user) {
    return <LoadingPage />;
  }

  return (
    <div>
      Calendar Page
    </div>
  )
} 