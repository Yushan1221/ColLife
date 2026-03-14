"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useAuth } from "@/src/hooks/useAuth";
import { useCanvasNavigation } from "@/src/hooks/useCanvasNavigation";
import { getCanvas, saveCanvas } from "@/src/utils/canvasOperations";
import { CanvasElement, TextElement } from "@/src/types/CanvasTypes";
import LoadingPage from "@/src/components/loading/LoadingPage";
import EditableText from "@/src/components/canvas/elements/EditableText";
import Sticker from "@/src/components/canvas/elements/Sticker";
import TextPanel from "@/src/components/canvas/panels/TextPanel";
import StickerPanel from "@/src/components/canvas/panels/StickerPanel";
import ViewBoard from "@/src/components/canvas/panels/ViewBoard";
import BackIcon from "@/src/components/icons/BackIcon";
import ArrowLeftIcon from "@/src/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/components/icons/ArrowRightIcon";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const { prevDate, nextDate } = useCanvasNavigation(user?.uid, date);
  const router = useRouter();

  // --- State ---
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "sticker" | "background">(
    "text",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
          setIsNew(true);
        }
      } catch (error) {
        console.error("初始化失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    initCanvas();
  }, [user, date, authLoading, router]);

  // 新增文字元件
  const addTextElement = () => {
    const newEl: TextElement = {
      id: "text-" + Date.now(),
      type: "text",
      content: "點擊兩下編輯文字",
      x: 100,
      y: 100,
      width: 200,
      rotation: 0,
      fontSize: 20,
      fill: "black",
      isBold: false,
      isItalic: false,
      fontFamily: "sans-serif",
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id); // 自動選取新元件
  };

  // 新增貼紙元件
  const addStickerElement = (svgPath: string) => {
    const newSticker: CanvasElement = {
      id: "sticker-" + Date.now(),
      type: "sticker",
      src: svgPath,
      x: 50,
      y: 50,
      rotation: 0,
      scale: 0.3,
    };
    setElements([...elements, newSticker]);
    setSelectedId(newSticker.id);
  };

  // 選取元件
  const selectElement = (el: CanvasElement) => {
    setSelectedId(el.id);
    setActiveTab(el.type);
  };

  // 刪除元件
  const deleteElement = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

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

  // 點擊畫布空白處取消選取
  const handleStageClick = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
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
        <ArrowLeftIcon className="w-12 h-12"/>
      </button>

      <div className="flex gap-10 bg-muted-light rounded-md w-4xl pl-10 pr-2 py-2 items-center justify-between bg-background">
        {/* 左側側邊欄 */}
        <div className="flex flex-1 flex-col h-[580px] gap-3">
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

              <div className="flex-1 p-5 text-center rounded-2xl border-2 border-border border-dashed">
                {activeTab === "text" && (
                  <TextPanel
                    onAddText={addTextElement}
                    onDelete={deleteElement}
                    selectedId={selectedId}
                  />
                )}

                {activeTab === "sticker" && (
                  <StickerPanel
                    onAddSticker={addStickerElement}
                    onDelete={deleteElement}
                    selectedId={selectedId}
                  />
                )}
              </div>
            </div>
          ) : (
            <ViewBoard setEditable={setEditable} />
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
              onMouseDown={handleStageClick}
              onTouchStart={handleStageClick}
            >
              <Layer>
                {elements.map((el) => {
                  if (el.type === "text") {
                    return (
                      <EditableText
                        key={el.id}
                        element={el as TextElement}
                        isSelected={el.id === selectedId}
                        isEditable={isEditable}
                        onSelect={() => selectElement(el)}
                        onChange={(newAttrs) => {
                          setElements(
                            elements.map((item) =>
                              item.id === el.id
                                ? ({ ...item, ...newAttrs } as CanvasElement)
                                : item,
                            ),
                          );
                        }}
                      />
                    );
                  }
                  if (el.type === "sticker") {
                    return (
                      <Sticker
                        key={el.id}
                        element={el}
                        isSelected={el.id === selectedId}
                        isEditable={isEditable}
                        onSelect={() => selectElement(el)}
                        onChange={(newAttrs) => {
                          setElements(
                            elements.map((item) =>
                              item.id === el.id
                                ? ({ ...item, ...newAttrs } as CanvasElement)
                                : item,
                            ),
                          );
                        }}
                      />
                    );
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
        <ArrowRightIcon className="w-12 h-12"/>
      </button>
    </div>
  );
}
