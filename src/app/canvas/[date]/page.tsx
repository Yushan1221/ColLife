"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Stage, Layer } from "react-konva";
import { useAuth } from "@/src/hooks/useAuth";
import { useCanvasNavigation } from "@/src/hooks/useCanvasNavigation";
import { getCanvas, saveCanvas } from "@/src/utils/canvasOperations";
import { StickerElement, TextElement } from "@/src/types/CanvasTypes";
import LoadingPage from "@/src/components/loading/LoadingPage";
import EditableText from "@/src/components/canvas/elements/EditableText";
import Sticker from "@/src/components/canvas/elements/Sticker";
import TextPanel from "@/src/components/canvas/panels/TextPanel";
import StickerPanel from "@/src/components/canvas/panels/StickerPanel";
import ViewBoard from "@/src/components/canvas/panels/ViewBoard";
import BackIcon from "@/src/components/icons/BackIcon";
import ArrowLeftIcon from "@/src/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/components/icons/ArrowRightIcon";
import { useCanvasStore } from "@/src/store/useCanvasStore";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const { prevDate, nextDate } = useCanvasNavigation(user?.uid, date);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    elements,
    setElements,
    isNew,
    setIsNew,
    isEditable,
    setEditable,
    activeTab,
    setActiveTab,
    clearSelection,
  } = useCanvasStore();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const initCanvas = async () => {
      try {
        const data = await getCanvas(user.uid, date);
        if (data) {
          // 不是第一次新增
          setElements(data.elements || []);
          setIsNew(false);
        } else {
          // 第一次新增
          setElements([]);
          setIsNew(true);
        }
      } catch (error) {
        console.error("初始化失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    initCanvas();
  }, [user, date, authLoading, router, setElements, setIsNew]);

  // 儲存
  const handleSave = async () => {
    if (!user || !date) return;
    setIsSaving(true);
    try {
      await saveCanvas(user.uid, date, elements, isNew);
      alert("儲存成功！");
      if (isNew) setIsNew(false);
    } catch (error) {
      console.error("儲存失敗:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) return <LoadingPage />;

  return (
    <div className="pt-25 flex justify-center items-center gap-3">
      <button
        onClick={() => router.push(`/canvas/${prevDate}`)}
        disabled={!prevDate}
        className="disabled:text-border disabled:opacity-50"
      >
        <ArrowLeftIcon className="w-12 h-12" />
      </button>

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
            <div className="flex gap-5 flex-1">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col justify-center items-center py-3 gap-3 w-20 border-2 border-dashed border-border rounded-2xl">
                  {/* 文字框 */}
                  <button
                    onClick={() => setActiveTab("text")}
                    className="w-12 h-12 bg-muted hover:bg-primary transition duration-300 rounded-md font-bold"
                  >
                    T
                  </button>
                  <button
                    onClick={() => setActiveTab("sticker")}
                    className="w-12 h-12 bg-muted hover:bg-primary transition duration-300 rounded-md font-bold"
                  >
                    S
                  </button>
                </div>
                <div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-20 py-1 bg-primary hover:bg-primary-hover rounded-md"
                  >
                    {isSaving ? "儲存中..." : "儲存畫布"}
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-0 p-5 text-center rounded-2xl border-2 border-border border-dashed">
                {activeTab === "text" && <TextPanel />}
                {activeTab === "sticker" && <StickerPanel />}
              </div>
            </div>
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
                {elements.map((el) => {
                  if (el.type === "text") {
                    return <EditableText key={el.id} element={el as TextElement} />;
                  }
                  if (el.type === "sticker") {
                    return <Sticker key={el.id} element={el as StickerElement} />;
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          </div>
        </main>
      </div>

      <button
        onClick={() => router.push(`/canvas/${nextDate}`)}
        disabled={!nextDate}
        className=" disabled:text-border disabled:opacity-50"
      >
        <ArrowRightIcon className="w-12 h-12" />
      </button>
    </div>
  );
}
