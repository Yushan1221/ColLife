import { useState, useEffect } from "react";
import { getRecordedDates } from "@/src/utils/canvasOperations";

export function useCanvasNavigation(userId: string | undefined, currentDate: string) {
  const [prevDate, setPrevDate] = useState<string | null>(null);
  const [nextDate, setNextDate] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNavigation = async () => {
      try {
        const recordedDates = await getRecordedDates(userId);
        
        const allDates = Array.from(new Set([...recordedDates, currentDate])).sort((a, b) => a.localeCompare(b));
        
        const currentIndex = allDates.indexOf(currentDate);

        // 如果不是第一天，就有上一頁
        if (currentIndex > 0) {
          setPrevDate(allDates[currentIndex - 1]);
        } else {
          setPrevDate(null);
        }

        // 如果不是最後一天，就有下一頁
        if (currentIndex < allDates.length - 1) {
          setNextDate(allDates[currentIndex + 1]);
        } else {
          setNextDate(null);
        }
        
      } catch (error) {
        console.error("計算翻頁日期失敗:", error);
      }
    };

    fetchNavigation();
  }, [userId, currentDate]);

  return { prevDate, nextDate };
}