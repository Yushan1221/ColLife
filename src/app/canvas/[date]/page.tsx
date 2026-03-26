"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Stage, Layer, Rect } from "react-konva";
import { useAuth } from "@/src/hooks/useAuth";
import { useCanvasNavigation } from "@/src/hooks/useCanvasNavigation";
import { getCanvas } from "@/src/utils/canvasOperations";
import { StickerElement, TextElement, ImageElement } from "@/src/types/CanvasTypes";
import LoadingPage from "@/src/components/loading/LoadingPage";
import EditableText from "@/src/components/canvas/elements/EditableText";
import Sticker from "@/src/components/canvas/elements/Sticker";
import EditableImage from "@/src/components/canvas/elements/EditableImage";
import ViewBoard from "@/src/components/canvas/panels/ViewBoard";
import BackIcon from "@/src/components/icons/BackIcon";
import ArrowLeftIcon from "@/src/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/components/icons/ArrowRightIcon";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import EditBoard from "@/src/components/canvas/panels/EditBoard";
import { useKeyboardDelete } from "@/src/hooks/useKeyboardDelete";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const { prevDate, nextDate } = useCanvasNavigation(user?.uid, date);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    elements,
    setElements,
    background,
    setBackground,
    setIsNew,
    isEditable,
    setEditable,
    clearSelection,
    resetStore
  } = useCanvasStore();

  // 啟用鍵盤刪除功能
  useKeyboardDelete();

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
  }, [user, date, authLoading, router, setElements, setIsNew, setBackground, resetStore]);

  if (authLoading || loading) return <LoadingPage />;

  return (
    <div className="pt-25 flex justify-center items-center gap-3">
      {!isEditable && (
        <button
          onClick={() => router.push(`/canvas/${prevDate}`)}
          disabled={!prevDate}
          className="disabled:text-border disabled:opacity-50"
        >
          <ArrowLeftIcon className="w-12 h-12" />
        </button>
      )}

      <div className="flex gap-5 bg-muted-light rounded-md w-4xl pl-10 pr-2 py-2 items-center justify-between bg-background">
        {/* 左側側邊欄 */}
        <div className="flex flex-1 flex-col h-[580px] w-90 gap-3">
          <div className="flex justify-start h-10 gap-3 items-center">
            {isEditable && (
              <button
                onClick={() => setEditable(false)}
                className="w-10 h-10 flex items-center justify-center border border-muted-light border-dashed hover:border-border hover:bg-background transition duration-300 rounded-full"
              >
                <BackIcon className="w-8 h-8" />
              </button>
            )}
            <h1 className="font-bold">{date}</h1>
          </div>

          {isEditable ? (
            <EditBoard date={date}/>
          ) : (
            <ViewBoard />
          )}
        </div>

        {/* 右側畫布區域 */}
        <main className="">
          <div
            className="bg-background"
            style={{ width: "450px", height: "600px" }}
          >
            <Stage
              width={450}
              height={600}
              onMouseDown={(e) => {
                // 只有點擊到空白背景（即點擊目標是 Stage 本身）時，才取消選取
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                  clearSelection();
                }
              }}
              onTouchStart={(e) => {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                  clearSelection();
                }
              }}
            >
              <Layer>
                <Rect
                  width={450}
                  height={600}
                  fill={background}
                  listening={false}
                />
              </Layer>
              <Layer>
                {elements.map((el) => {
                  if (el.type === "text") {
                    return (
                      <EditableText key={el.id} element={el as TextElement} />
                    );
                  }
                  if (el.type === "sticker") {
                    return (
                      <Sticker key={el.id} element={el as StickerElement} />
                    );
                  }
                  if (el.type === "image") {
                    return (
                      <EditableImage key={el.id} element={el as ImageElement} />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          </div>
        </main>
      </div>

      {!isEditable && (
        <button
          onClick={() => router.push(`/canvas/${nextDate}`)}
          disabled={!nextDate}
          className=" disabled:text-border disabled:opacity-50"
        >
          <ArrowRightIcon className="w-12 h-12" />
        </button>
      )}
    </div>
  );
}
