"use client";

import PanelSwitcher from "./PanelSwitcher";
import BackgroundPanel from "./BackgroundPanel";
import TextPanel from "./TextPanel";
import StickerPanel from "./StickerPanel";
import ImagePanel from "./ImagePanel";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { saveCanvas } from "@/src/utils/canvasOperations";
import { useEffect, useCallback } from "react";
import { getUserImages } from "@/src/utils/imageOperations";
import LayerPanel from "./LayerPanel";
import BackIcon from "../../icons/BackIcon";

interface EditBoardProps {
  date: string;
}

export default function EditBoard({ date }: EditBoardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const { user } = useAuth();
  const {
    elements,
    activeTab,
    isNew,
    background,
    isEditable,
    setIsNew,
    setSelectedId,
    setActiveTab,
    setUserImages,
    setEditable,
  } = useCanvasStore();

  // 重置編輯頁面狀態
  const resetEditableState = useCallback(() => {
    setSelectedId(null);
    setActiveTab("text");
    setUserImages([]);
  }, [setSelectedId, setActiveTab, setUserImages]);

  // 獲取使用者圖片列表
  const fetchImages = useCallback(async () => {
    if (!user) return;
    setImgLoading(true);
    try {
      const data = await getUserImages(user.uid);
      setUserImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setImgLoading(false);
    }
  }, [user, setUserImages]);

  useEffect(() => {
    fetchImages();

    return () => resetEditableState();
  }, [fetchImages, resetEditableState]);

  // 儲存
  const handleSave = async () => {
    if (!user || !date) return;
    setIsSaving(true);
    try {
      await saveCanvas(user.uid, date, elements, isNew, background);
      alert("儲存成功！");
      if (isNew) setIsNew(false);
    } catch (error) {
      console.error("儲存失敗:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <button
        onClick={() => setEditable(false)}
        className="ml-auto mb-2 w-10 h-10 flex items-center justify-center border border-muted-light border-dashed hover:border-border hover:bg-background transition duration-300 rounded-full"
      >
        <BackIcon className="w-8 h-8" />
      </button>

      <div className="flex gap-5 h-140">
        <div className="flex flex-col gap-5 justify-start">
          <PanelSwitcher />
          <LayerPanel />
          <div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-20 py-1 bg-primary hover:bg-primary-hover rounded-md"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 py-3 px-5 text-center rounded-2xl border-2 border-border border-dashed">
          {activeTab === "background" && <BackgroundPanel />}
          {activeTab === "text" && <TextPanel />}
          {activeTab === "sticker" && <StickerPanel />}
          {activeTab === "image" && (
            <ImagePanel onRefresh={fetchImages} isLoading={imgLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
