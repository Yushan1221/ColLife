"use client";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/src/components/loading/LoadingPage";
import PinIcon from "@/src/components/icons/PinIcon";
import { getRecordedDates } from "@/src/utils/canvasOperations";

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  fullDate: string;
  targetYear: number;
  targetMonth: number;
}

// 月份的英文縮寫
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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 狀態管理
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recordedDates, setRecordedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const fetchDates = async () => {
      try {
        const dates = await getRecordedDates(user.uid);
        setRecordedDates(dates);
      } catch (error) {
        console.error("抓取日期失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [user, authLoading, router]);

  // 切換月份
  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth));
  };

  // 切換年份
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
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // 上個月
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      const targetYear = month === 0 ? year - 1 : year;
      const targetMonth = month === 0 ? 11 : month - 1;
      days.push({
        day,
        isCurrentMonth: false,
        fullDate: `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        targetYear,
        targetMonth,
      });
    }

    // 這個月
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        targetYear: year,
        targetMonth: month,
      });
    }

    // 下個月
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const targetYear = month === 11 ? year + 1 : year;
      const targetMonth = month === 11 ? 0 : month + 1;
      days.push({
        day: i,
        isCurrentMonth: false,
        fullDate: `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        targetYear,
        targetMonth,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto items-center justify-center gap-6 lg:gap-8 min-h-dvh py-25 px-4 lg:px-10 bg-background overflow-y-auto">
      {/* 左側/上方：日期資訊 */}
      <div className="flex flex-col sm:flex-row items-center lg:items-end justify-center w-full lg:w-auto">
        <div className="w-full sm:w-[230px]">
          {/* 月份切換網格 - 手機版 6 欄，平板以上 4 欄 */}
          <div className="grid grid-cols-6 sm:grid-cols-4 gap-1 sm:gap-2 pb-2 sm:pb-4 text-muted mb-4 lg:mb-8">
            {MONTHS.map((m, index) => (
              <button
                key={m}
                onClick={() => handleMonthChange(index)}
                className={`flex justify-center items-center text-[10px] sm:text-xs py-1 font-bold rounded-md transition-colors cursor-pointer ${
                  month === index
                    ? "bg-primary text-foreground shadow-sm"
                    : "bg-transparent hover:bg-muted-light"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {/* 大月份文字 - 響應式字體大小 */}
          <div className="text-6xl sm:text-7xl lg:text-[5rem] leading-none font-black tracking-tighter text-black uppercase text-center sm:text-left">
            {MONTHS[month]}
          </div>
        </div>

        {/* 年份顯示 */}
        <div className="flex sm:flex-col items-center justify-between sm:h-40 mt-4 sm:mt-0 sm:ml-4 gap-4 sm:gap-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black flex items-center justify-center text-lg sm:text-xl font-bold">
            {month < 9 ? "0" + (month + 1) : month + 1}
          </div>
          <div className="flex flex-row sm:flex-col items-center text-2xl sm:text-3xl font-bold leading-tight">
            <span>{String(year).slice(0, 2)}</span>
            <span className="sm:inline hidden"></span>
            <span>{String(year).slice(2, 4)}</span>
          </div>
        </div>

        {/* 年份切換按鈕 */}
        <div className="flex sm:flex-col gap-2 ml-4 mt-4 sm:mt-0 sm:mb-2">
          <button
            onClick={() => handleYearChange(1)}
            className="transition rounded-full bg-muted hover:bg-muted-light p-1 duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8l-6 6h12z" />
            </svg>
          </button>
          <button
            onClick={() => handleYearChange(-1)}
            className="transition-colors rounded-full bg-muted hover:bg-muted-light p-1 duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 16l6-6H6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 右側/下方：日曆網格 */}
      <div className="w-full max-w-2xl lg:flex-1">
        <div className="border-2 border-dashed bg-muted-light border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl relative">
          <div className="grid grid-cols-7 gap-1">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] sm:text-xs lg:text-md text-border font-bold py-1 sm:py-2"
              >
                {day}
              </div>
            ))}

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
                  className="group relative h-10 sm:h-14 lg:h-18 p-1 sm:p-2 border border-background border-dashed rounded-lg sm:rounded-2xl bg-muted-light flex flex-col items-start justify-start hover:bg-primary transition-colors cursor-pointer"
                >
                  <span
                    className={`text-sm sm:text-lg font-bold z-10 ${dateObj.isCurrentMonth ? "text-foreground" : "text-muted"} group-hover:text-background`}
                  >
                    {dateObj.day}
                  </span>

                  {hasRecord && (
                    <div className="absolute right-1 bottom-1 sm:right-2 sm:bottom-2 flex items-center justify-center text-primary group-hover:text-white drop-shadow-sm">
                      <PinIcon className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
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
