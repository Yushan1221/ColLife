"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useCanvasNavigation } from "@/src/hooks/useCanvasNavigation";
import { getCanvas } from "@/src/utils/canvasOperations";
import LoadingPage from "@/src/components/loading/LoadingPage";
import ViewBoard from "@/src/components/canvas/panels/ViewBoard";
import ArrowLeftIcon from "@/src/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/components/icons/ArrowRightIcon";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import EditBoard from "@/src/components/canvas/panels/EditBoard";
import CanvasStage from "@/src/components/canvas/CanvasStage";
import EditBoardTablet from "@/src/components/canvas/panels/EditBoardTablet";
import ViewBoardTablet from "@/src/components/canvas/panels/ViewBoardTablet";
import ArrowSingleLIcon from "@/src/components/icons/ArrowSingleLIcon";
import ArrowSingleRIcon from "@/src/components/icons/ArrowSingleRIcon";
import BackGround from "@/src/components/canvas/Background";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const { prevDate, nextDate } = useCanvasNavigation(user?.uid, date);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { setElements, setBackground, setIsNew, isEditable, resetStore } =
    useCanvasStore();

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
    <div className="relative pt-25 sm:px-8 px-2 flex flex-col gap-3">
      <BackGround />

      <div className="flex lg:justify-center sm:justify-between sm:gap-3 gap-1 items-center justify-center">
        {!isEditable && (
          <button
            onClick={() => router.push(`/canvas/${prevDate}`)}
            disabled={!prevDate}
            className="disabled:text-border disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-12 h-12 sm:block hidden" />
            <ArrowSingleLIcon className="w-4 h-4 sm:hidden"/>
          </button>
        )}

        {/* 左側側邊欄-tablet */}
        {isEditable && <EditBoardTablet date={date} />}

        <div className="relative lg:w-5xl sm:w-[75%] w-[90%] flex bg-muted-light rounded-lg border-standard sm:p-5 p-3 items-center justify-between gap-5 shadow-lg">
          {/* 左側側邊欄-desktop */}
          {isEditable ? <EditBoard date={date} /> : <ViewBoard />}

          {/* 右側畫布區域 */}
          <CanvasStage />

          {/* 標籤日期 */}
          <div className="lg:block hidden absolute top-3 -left-3 p-2 bg-muted -rotate-12 rounded-md shadow-md">
            <div className="font-bold py-1 px-3 border border-dashed border-foreground rounded-sm">
              {date}
            </div>
          </div>
        </div>

        {!isEditable && (
          <button
            onClick={() => router.push(`/canvas/${nextDate}`)}
            disabled={!nextDate}
            className=" disabled:text-border disabled:opacity-50 "
          >
            <ArrowRightIcon className="w-12 h-12 hidden sm:block" />
            <ArrowSingleRIcon className="w-4 h-4 sm:hidden"/>
          </button>
        )}
      </div>

      {/* 左側側邊欄-tablet */}
      {!isEditable && <ViewBoardTablet />}
    </div>
  );
}
