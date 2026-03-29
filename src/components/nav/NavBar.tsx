"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import UserBox from "./UserBox";

export default function NavBar() {
  const { user, openAuthModal } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // 監控滾動位置變化
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // 往下捲動且超過一定距離就隱藏，往上捲動則顯示
    if (latest > previous && latest > 30) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-200%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="mt-4 sm:mt-8 flex justify-between items-center fixed top-0 w-full px-4 sm:px-8 z-50"
    >
      <Link href="/" className="flex justify-center items-center gap-1">
        <Image
          src="/logo.png"
          alt="ColLife"
          width={45}
          height={45}
          className="sm:w-[65px] sm:h-[65px]"
        />
        <h1 className="text-xl sm:text-3xl">ColLife</h1>
      </Link>
      {!user ? (
        <button
          onClick={openAuthModal}
          className="py-1 px-1 text-sm sm:text-base bg-primary cursor-pointer rounded-md border-dashed hover:bg-primary-hover hover:shadow-md transition duration-300"
        >
          <div className="border border-dashed py-0.5 sm:py-1 px-2 sm:px-5 rounded-sm ">點此開始設計！</div>
        </button>
      ) : (
        <UserBox />
      )}
    </motion.div>
  );
}
