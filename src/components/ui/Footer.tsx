import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-20 w-full mt-5 bg-background border-t-2 border-dashed border-border py-10 px-6 sm:px-10 lg:px-20">
        {/* 右側：版權宣告與標籤 */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted">
            © {currentYear} ColLife. All rights reserved.
          </p>
        </div>
    </footer>
  );
}
