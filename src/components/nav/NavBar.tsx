"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/hooks/useAuth";
import UserBox from "./UserBox";

export default function NavBar() {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="h-30 flex justify-between items-center fixed px-8 w-full">
      <Link href="/">
        <Image src="/logo.png" alt="ColLife" width={150} height={35} />
      </Link>
      {!user ? (
        <button onClick={openAuthModal} className="h-10 px-6 bg-primary cursor-pointer rounded-md font-bold border-dashed hover:bg-primary-hover hover:shadow-md transition duration-300">
          點此開始設計！
        </button>
      ) : (
        <UserBox />
      )}
    </div>
  );
}
