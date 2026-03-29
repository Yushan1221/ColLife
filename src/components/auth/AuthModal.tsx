'use client';

import { useAuth } from '@/src/hooks/useAuth';
import AuthForm from './AuthForm';
import CloseIcon from '../icons/CloseIcon';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  // 如果狀態是關閉的，就不渲染任何東西
  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity">
      <div 
        className="absolute inset-0" 
        onClick={closeAuthModal}
        aria-label="關閉登入視窗"
      ></div>

      <div className="relative z-10 w-[90%] sm:w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl mx-4">
        <button 
          onClick={closeAuthModal}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 z-20 text-border transition hover:text-foreground cursor-pointer"
          aria-label="關閉"
        >
          <CloseIcon className='w-5 h-5'/>
        </button>

        <div className="py-6 px-4 sm:py-8 sm:px-6">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}