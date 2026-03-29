"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useCanvasNavigation } from "@/src/hooks/useCanvasNavigation";
import { getCanvas } from "@/src/utils/canvasOperations";
import LoadingPage from "@/src/components/loading/LoadingPage";
import ViewBoard from "@/src/components/canvas/panels/ViewBoard";
import BackIcon from "@/src/components/icons/BackIcon";
import ArrowLeftIcon from "@/src/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/components/icons/ArrowRightIcon";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import EditBoard from "@/src/components/canvas/panels/EditBoard";
import CanvasStage from "@/src/components/canvas/CanvasStage";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const { prevDate, nextDate } = useCanvasNavigation(user?.uid, date);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    setElements,
    setBackground,
    setIsNew,
    isEditable,
    setEditable,
    resetStore,
  } = useCanvasStore();

  useEffect(() => {
    if (authLoading) return;
    if (!user || !date) {
      router.push("/");
      return;
    }

    const initCanvas = async () => {
      try {
        const data = await getCanvas(user.uid, date);
        if (data) {
          // 不是第一次新增
          setElements(data.elements || []);
          setBackground(data.background);
          setIsNew(false);
        }
      } catch (error) {
        console.error("初始化失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    initCanvas();

    return () => resetStore(); // 重製初始 state
  }, [
    user,
    date,
    authLoading,
    router,
    setElements,
    setIsNew,
    setBackground,
    resetStore,
  ]);

  if (authLoading || loading) return <LoadingPage />;

  return (
    <div className="pt-25 flex justify-center items-center gap-3 ">
      {!isEditable && (
        <button
          onClick={() => router.push(`/canvas/${prevDate}`)}
          disabled={!prevDate}
          className="disabled:text-border disabled:opacity-50 hidden md:block pl-3"
        >
          <ArrowLeftIcon className="w-12 h-12" />
        </button>
      )}

      <div className="relative xl:w-5xl w-[90%] flex bg-muted-light rounded-lg border-standard p-5 items-center justify-between gap-5 shadow-lg">
        {/* 左側側邊欄 */}
        <div className="lg:flex hidden flex-1 flex-col w-90 gap-3">
          {isEditable ? <EditBoard date={date} /> : <ViewBoard />}
        </div>

        {/* 右側畫布區域 */}
        <CanvasStage />

        {/* 標籤日期 */}
        <div className="absolute top-5 -left-3 p-2 bg-muted -rotate-12 rounded-md shadow-md">
          <div className="font-bold py-1 px-3 border border-dashed border-foreground rounded-sm">
            {date}
          </div>
        </div>
      </div>

      {!isEditable && (
        <button
          onClick={() => router.push(`/canvas/${nextDate}`)}
          disabled={!nextDate}
          className=" disabled:text-border disabled:opacity-50 hidden md:block pr-3"
        >
          <ArrowRightIcon className="w-12 h-12" />
        </button>
      )}
    </div>
  );
}
