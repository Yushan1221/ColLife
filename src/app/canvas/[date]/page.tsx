"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { useAuth } from "@/src/hooks/useAuth";
import { getCanvas, saveCanvas } from "@/src/utils/canvasOperations";
import { CanvasElement } from "@/src/types/CanvasTypes";
import LoadingPage from "@/src/components/loading/LoadingPage";
import EditableText from "@/src/components/canvas/EditableText";
import StickerElement from "@/src/components/canvas/StickerElement";
import TextPanel from "@/src/components/canvas/panels/TextPanel";
import StickerPanel from "@/src/components/canvas/panels/StickerPanel";

export default function CanvasPage() {
  const params = useParams();
  const date = typeof params?.date === "string" ? params.date : "";
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- State ---
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "sticker" | "background">(
    "text",
  );

  // 選取與編輯
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [textareaPos, setTextareaPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [tempText, setTempText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // 新增元件
  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: "text-" + Date.now(),
      type: "text",
      content: "點擊兩下編輯文字",
      x: 100,
      y: 100,
      rotation: 0,
      scale: 1,
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id); // 自動選取新元件
  };

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

  // 刪除元件
  const deleteElement = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  // 文字編輯邏輯
  const handleTextDblClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    el: CanvasElement,
  ) => {
    const textNode = e.target as Konva.Text;
    const stage = textNode.getStage();
    if (!stage) return;

    const stageBox = stage.container().getBoundingClientRect();

    setEditingId(el.id);
    setTempText(el.content || "");

    setTextareaPos({
      x: stageBox.left + textNode.x(),
      y: stageBox.top + textNode.y(),
      width: textNode.width() * textNode.scaleX(),
      height: textNode.height() * textNode.scaleY(),
    });

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleTextDone = () => {
    if (editingId) {
      setElements(
        elements.map((el) =>
          el.id === editingId ? { ...el, content: tempText } : el,
        ),
      );
    }
    setEditingId(null);
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

  // 切換側邊顯示面板
  const renderPanelContent = () => {
    switch (activeTab) {
      case "text":
        return <TextPanel onAddText={addTextElement} onDelete={deleteElement} selectedId={selectedId}/>;
      case "sticker":
        return <StickerPanel onAddSticker={addStickerElement} onDelete={deleteElement} selectedId={selectedId}/>;
      case "background":
        return <div>背景設定面板</div>;
      default:
        return <div>請選擇一個工具</div>; // 防呆預設值
    }
  };

  if (authLoading || loading) return <LoadingPage />;

  return (
    <div className="pt-25 flex justify-center items-center">
      <div className="flex gap-10 bg-muted-light rounded-md w-4xl pl-10 pr-2 py-2 items-center justify-between mx-auto bg-background">
        {/* 左側側邊欄 */}
        <div className="flex flex-1 flex-col h-[550px] gap-5">
          <h1 className="font-bold">{date}</h1>
          <div className="flex gap-5 flex-1">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col justify-center items-center py-3 gap-3 w-20 border-2 border-dashed border-border rounded-2xl">
                {/* 文字框 */}
                <button
                  onClick={() => setActiveTab('text')}
                  className="w-12 h-12 bg-muted hover:bg-primary transition duration-300 rounded-md font-bold"
                >
                  T
                </button>
                <button
                  onClick={() => setActiveTab('sticker')}
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
              {renderPanelContent()}
              
            </div>
          </div>
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
                        element={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onDblClick={(e) => handleTextDblClick(e, el)}
                        onChange={(newAttrs) => {
                          setElements(
                            elements.map((item) =>
                              item.id === el.id
                                ? { ...item, ...newAttrs }
                                : item,
                            ),
                          );
                        }}
                      />
                    );
                  }
                  if (el.type === "sticker") {
                    return (
                      <StickerElement
                        key={el.id}
                        element={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs) => {
                          setElements(
                            elements.map((item) =>
                              item.id === el.id
                                ? { ...item, ...newAttrs }
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

            {/* 文字編輯用 TextArea Overlay */}
            {editingId && (
              <textarea
                ref={textareaRef}
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onBlur={handleTextDone}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleTextDone()
                }
                style={{
                  position: "fixed",
                  left: textareaPos.x,
                  top: textareaPos.y,
                  width: Math.max(textareaPos.width, 150),
                  height: Math.max(textareaPos.height, 40),
                  fontSize: "20px",
                  border: "1px solid #A9B388",
                  outline: "none",
                  padding: "0",
                  margin: "0",
                  background: "white",
                  zIndex: 1000,
                  resize: "none",
                  overflow: "hidden",
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
