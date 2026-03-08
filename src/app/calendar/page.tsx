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
    <div className="flex max-w-5xl mx-auto items-center justify-center gap-8 h-dvh min-h-150 bg-background">
      {/* 左側日期 */}
      <div className="flex items-end">
        <div className="w-[230px]">
          <div className="grid grid-cols-4 gap-2 pb-4 text-muted">
            {MONTHS.map((m, index) => (
              <button
                key={m}
                onClick={() => handleMonthChange(index)}
                className={`flex justify-center items-center text-xs py-1 font-bold rounded-md transition-colors cursor-pointer ${
                  month === index
                    ? "bg-primary text-foreground shadow-sm"
                    : "bg-transparent hover:bg-muted-light"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="text-[6rem] leading-none font-black tracking-tighter text-black uppercase">
            {MONTHS[month]}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between h-40 ml-4">
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-xl font-bold">
            {month < 9 ? "0" + (month + 1) : month + 1}
          </div>
          <div className="flex flex-col items-center text-3xl font-bold leading-tight">
            <span>{String(year).slice(0, 2)}</span>
            <span>{String(year).slice(2, 4)}</span>
          </div>
        </div>

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

      {/* 右側：日曆網格 */}
      <div className="flex-1">
        <div className="border-2 border-dashed bg-muted-light border-border rounded-2xl p-8 shadow-xl z-0 relative">
          <div className="grid grid-cols-7">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div
                key={day}
                className="text-center text-md text-border font-bold py-2 mx-[1px] mb-1"
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
                  className="group relative h-18 m-1 p-2 border-2 border-background border-dashed rounded-2xl bg-muted-light flex flex-col items-start justify-start hover:bg-primary transition-colors cursor-pointer"
                >
                  <span
                    className={`text-lg font-bold z-10 ${dateObj.isCurrentMonth ? "text-foreground" : "text-muted"} group-hover:text-background`}
                  >
                    {dateObj.day}
                  </span>

                  {hasRecord && (
                    <div className="absolute right-2 bottom-2 flex items-center justify-center text-primary group-hover:text-white drop-shadow-sm">
                      <PinIcon className="w-6 h-6 animate-pulse" />
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
