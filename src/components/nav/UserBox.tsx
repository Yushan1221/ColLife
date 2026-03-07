import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
import CalendarIcon from "../icons/CalendarIcon";

export default function UserBox() {
  const { signout } = useAuth();
  const router = useRouter();

  return (
    <div className="relative group">
      <button className="flex justify-center items-center rounded-full bg-primary w-10 h-10 border border-border border-dashed cursor-pointer text-background">
        <UserIcon />
      </button>

      {/* 透明外框讓連接部分不會脫離hover */}
      <div className="absolute right-0 top-full pt-1 opacity-0 invisible translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
        <div className="overflow-hidden bg-background py-2 px-3 border-border border border-dashed translate-y-1 rounded-md shadow-md">
          <button 
            onClick={() => {router.push("/calendar")}}
            className="flex items-center w-full gap-2 cursor-pointer p-2 rounded-md hover:bg-muted-light transition">
            <CalendarIcon className="w-4 h-4"/>
            calendar
          </button>

          <button
            className="flex items-center w-full gap-2 cursor-pointer p-2 rounded-md hover:bg-muted-light transition"
            onClick={signout}
          >
            <LogoutIcon className="w-4 h-4"/>
            signout
          </button>
        </div>
      </div>
    </div>
  );
}
