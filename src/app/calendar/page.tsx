"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/src/components/loading/LoadingPage";
import PinIcon from "@/src/components/icons/PinIcon";

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  fullDate: string;
  targetYear: number;
  targetMonth: number;
}

// 月份的英文縮寫（對應你的標籤與大字體）
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 狀態管理：當前選擇的年份與月份 (Date 物件的月份是 0-11)
  const [currentDate, setCurrentDate] = useState(new Date()); // 預設為當前日期
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 假資料：模擬已經有紀錄的日子
  const [recordedDates] = useState(["2026-06-08", "2026-06-15", "2026-06-24"]);

  // 切換月份 (點擊上方標籤)
  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth));
  };

  // 切換年份 (點擊年份旁邊的按鈕)
  const handleYearChange = (offset: number) => {
    setCurrentDate(new Date(year + offset, month));
  };

  // 跳轉到畫布頁面
  const handleDateClick = (
    clickedYear: number,
    clickedMonth: number,
    day: number,
  ) => {
    const formattedMonth = String(clickedMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    router.push(`/canvas/${clickedYear}-${formattedMonth}-${formattedDay}`);
  };

  // --- 日曆核心演算法 ---
  const generateCalendarDays = (): CalendarDay[] => {
    // 取得這個月第一天是星期幾 (0 = 日, 1 = 一, ... 6 = 六)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // 取得這個月總共有幾天
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 取得上個月總共有幾天
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // 「上個月」的日期
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push({
        day,
        isCurrentMonth: false,
        fullDate: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        targetYear: month === 0 ? year - 1 : year,
        targetMonth: month === 0 ? 11 : month - 1,
      });
    }

    // 「這個月」的真實日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        targetYear: year,
        targetMonth: month,
      });
    }

    // 「下個月」的日期，確保日曆永遠是 6 行 (42格) 
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        fullDate: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        targetYear: month === 11 ? year + 1 : year,
        targetMonth: month === 11 ? 0 : month + 1,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // 載入中顯示
  if (loading || !user) {
    return <LoadingPage />;
  }

  return (
    <div className="flex max-w-5xl mx-auto items-center justify-center gap-8 h-dvh min-h-150 bg-background">
      {/* 左側日期 */}
      <div className="flex items-end">
        <div className="w-[230px]">
          {/* 月份切換按鈕 */}
          <div className="grid grid-cols-4 gap-2 pb-4 text-muted">
            {MONTHS.map((m, index) => (
              <button
                key={m}
                onClick={() => handleMonthChange(index)}
                className={`flex justify-center items-center text-xs py-1 font-bold rounded-md transition-colors ${
                  month === index
                    ? "bg-primary text-foreground"
                    : "bg-transparent hover:bg-muted-light"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {/* 大月份縮寫 */}
          <div className="text-[6rem] leading-none font-black tracking-tighter text-black leading-none uppercase">
            {MONTHS[month]}
          </div>
        </div>

        {/* 右側小資訊 (月份與年份) */}
        <div className="flex flex-col items-center justify-between h-40 ml-4">
          {/* 月份(數字) */}
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-xl font-bold">
            {month < 9 ? "0" + (month + 1) : month + 1}
          </div>

          {/* 垂直排列的年份 */}
          <div className="flex flex-col items-center text-3xl font-bold leading-tight">
            <span>{String(year).slice(0, 2)}</span>
            <span>{String(year).slice(2, 4)}</span>
          </div>
        </div>

        {/* 年份切換按鈕 (調整位置以便操作) */}
        <div className="flex flex-col gap-2 ml-4 mb-2">
          <button
            onClick={() => handleYearChange(1)}
            className="transition rounded-full bg-muted hover:bg-muted-light duration-300 cursor-pointer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8l-6 6h12z" />
            </svg>
          </button>
          <button
            onClick={() => handleYearChange(-1)}
            className="transition-colors rounded-full bg-muted hover:bg-muted-light duration-300 cursor-pointer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16l6-6H6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 右側：月份標籤與日曆網格 (填滿剩餘寬度) */}
      <div className="flex-1">
        {/* 日曆資料夾主體 */}
        <div className="border-2 border-dashed bg-muted-light border-border rounded-2xl p-8 shadow-xl z-0 relative">
          {/* 日曆網格 (7欄) */}
          <div className="grid grid-cols-7">
            {/* 星期幾的標題 */}
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                className="text-center text-md text-border font-bold py-2 mx-[1px] mb-1"
              >
                {day}
              </div>
            ))}

            {/* 日期格子 */}
            {calendarDays.map((dateObj, index) => {
              const hasRecord = recordedDates.includes(dateObj.fullDate);

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleDateClick(
                      dateObj.targetYear,
                      dateObj.targetMonth,
                      dateObj.day,
                    )
                  }
                  className="group relative h-18 m-1 p-2 border-2 border-background border-dashed rounded-2xl bg-muted-light flex flex-col items-start justify-start hover:bg-primary transition-colors group"
                >
                  {/* 日期數字 */}
                  <span
                    className={`text-lg font-bold z-10 ${dateObj.isCurrentMonth ? "text-foreground" : "text-muted"} group-hover:text-background`}
                  >
                    {dateObj.day}
                  </span>

                  {/* 若有紀錄，顯示 Icon */}
                  {hasRecord && (
                    <div className="absolute right-2 bottom-2 flex items-center justify-center text-primary group-hover:text-muted">
                      <PinIcon className="w-6 h-6" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
