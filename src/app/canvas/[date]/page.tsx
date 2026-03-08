'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import LoadingPage from '@/src/components/loading/LoadingPage';

export default function CanvasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

  }, [user, router]);

  if (authLoading) return <LoadingPage />;

  return (
    <div className="pt-20 text-center">
      Canvas Page
    </div>
  );
}
