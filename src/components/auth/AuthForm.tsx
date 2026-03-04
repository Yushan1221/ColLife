"use client";
import { useState } from "react";
import Image from "next/image";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/src/hooks/useAuth";
import MailIcon from "../icons/MailIcon";
import KeyIcon from "../icons/KeyIcon";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { signIn, signUp, signInWithGoogle, closeAuthModal } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false); // 註冊or登入 狀態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 處理表單送出
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      setEmail("");
      setPassword("");

      // 直接導入日曆頁面
      setTimeout(() => {
        closeAuthModal();
        router.push("/calendar");
      }, 800);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        alert(`登入或註冊失敗：${error.code}`);
      } else {
        alert("發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      await signInWithGoogle();

      setEmail("");
      setPassword("");

      // 直接導入日曆頁面
      setTimeout(() => {
        closeAuthModal();
        router.push("/calendar");
      }, 800);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        alert(`${isRegistering ? "註冊" : "登入"}失敗：${error.code}`);
      } else {
        alert("發生未知錯誤");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-3 rounded-3xl">
      <div
        className="flex rounded-xl bg-muted-light my-6"
      >
        <button
          type="button"
          onClick={() => setIsRegistering(false)}
          className={`
            px-10 py-2 rounded-l-xl font-bold text-lg cursor-pointer transition duration-300 border-dashed border-1
            ${!isRegistering ? "bg-background shadow-md border-border" : "text-muted border-muted-light"}
          `}
        >
          登入
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(true)}
          className={`
            px-10 py-2 rounded-r-xl font-bold text-lg cursor-pointer transition duration-300 border-dashed border-1
            ${isRegistering ? "bg-background shadow-md border-border " : "text-muted border-muted-light"}
          `}
        >
          註冊
        </button>
      </div>

      <form
        className="flex flex-col items-center text-lg gap-3"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex bg-muted-light rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-background rounded-l-xl border-dashed border-1 border-border">
            <MailIcon />
          </div>
          <input
            className="px-1 pl-3"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="請輸入信箱"
            required
          />
        </div>

        <div className="w-full flex bg-muted-light rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-background rounded-l-xl border-dashed border-1 border-border">
            <KeyIcon />
          </div>
          <input
            className="px-1 pl-3"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="請輸入密碼"
            minLength={6}
            required
          />
        </div>

        <button
          className="w-full py-3 px-6 bg-primary rounded-xl font-bold text-background cursor-pointer hover:bg-primary-hover transition duration-300 "
          type="submit"
        >
          {loading ? "讀取中..." : isRegistering ? "註冊" : "登入"}
        </button>
      </form>

      <div className="flex flex-col align-center justify-center pt-4">
        <p>或以 Google 帳號{isRegistering ? "註冊" : "登入"}</p>
        <div className="flex align-center justify-center pt-2">
          <button
            onClick={handleGoogleSubmit}
            disabled={loading}
            className="p-1 rounded-sm border-dashed border-1 border-background hover:border-border hover:shadow-md transition duration-300 cursor-pointer"
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 59 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.208 2.44165C9.61781 2.44165 7.1337 3.4706 5.30215 5.30215C3.4706 7.1337 2.44165 9.61781 2.44165 12.208V46.3903C2.44165 48.9805 3.4706 51.4646 5.30215 53.2961C7.1337 55.1277 9.61781 56.1566 12.208 56.1566H46.3903C48.9805 56.1566 51.4646 55.1277 53.2961 53.2961C55.1277 51.4646 56.1566 48.9805 56.1566 46.3903V12.208C56.1566 9.61781 55.1277 7.1337 53.2961 5.30215C51.4646 3.4706 48.9805 2.44165 46.3903 2.44165H12.208ZM12.9039 19.2886C16.2366 13.5851 22.3333 9.76642 29.2991 9.76642C34.9661 9.76642 39.4317 11.583 42.618 14.5837L37.1195 20.4191C35.7627 19.2915 34.1655 18.49 32.4506 18.076C30.7357 17.662 28.9487 17.6465 27.2269 18.0308C25.5051 18.4151 23.8943 19.189 22.5182 20.2929C21.142 21.3968 20.0372 22.8014 19.2886 24.3989L12.9039 19.2886ZM41.5315 44.9546C38.4429 47.3889 34.3483 48.8318 29.2991 48.8318C22.3064 48.8318 16.1902 44.9839 12.8672 39.2437L19.335 34.2946C19.9958 35.6717 20.9232 36.9039 22.0636 37.92C23.2041 38.936 24.5348 39.7156 25.9787 40.2136C27.4226 40.7117 28.9509 40.9182 30.4752 40.8213C31.9995 40.7244 33.4894 40.3259 34.8586 39.649L34.8122 39.7052L41.5266 44.9546H41.5315ZM43.5043 43.1161C46.7248 39.5807 48.3899 34.695 48.3899 29.2991C48.3899 28.0857 48.3069 26.899 48.1384 25.7491H29.2991V32.8516H40.7282C40.057 34.9192 38.8164 36.7555 37.1488 38.1499L43.5019 43.1161H43.5043ZM18.4341 31.6284C18.1285 30.1358 18.1202 28.5975 18.4096 27.1017L11.6953 21.7302C10.7106 24.1311 10.2063 26.7017 10.2108 29.2967C10.2108 31.958 10.7308 34.49 11.6709 36.8021L18.4341 31.626V31.6284Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
