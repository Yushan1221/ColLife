"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[100]">
      {/* 標誌跳動動畫 */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-24 h-24 sm:w-32 sm:h-32 mb-8"
      >
        <Image 
          src="/logo.png" 
          alt="ColLife Loading" 
          fill
          priority
          className="object-contain drop-shadow-lg"
        />
      </motion.div>
      
      {/* 文字與小圓點動畫 */}
      <div className="flex flex-col items-center gap-4">
        <motion.span 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl sm:text-2xl font-bold text-primary tracking-[0.2em] uppercase"
        >
          Collecting Moments
        </motion.span>
        
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                backgroundColor: ["#A4AF83", "#B66F54", "#A4AF83"]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-primary shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
