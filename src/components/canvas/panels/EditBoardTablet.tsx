"use client";

import PanelSwitcher from "./PanelSwitcher";
import BackgroundPanel from "./BackgroundPanel";
import TextPanel from "./TextPanel";
import StickerPanel from "./StickerPanel";
import ImagePanel from "./ImagePanel";
import { useAuth } from "@/src/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { saveCanvas } from "@/src/utils/canvasOperations";
import { getUserImages } from "@/src/utils/imageOperations";
import { motion, AnimatePresence } from "framer-motion";
import LayerPanel from "./LayerPanel";
import BackIcon from "../../icons/BackIcon";
import ArrowSingleRIcon from "../../icons/ArrowSingleRIcon";

interface EditBoardProps {
  date: string;
}

export default function EditBoardTablet({ date }: EditBoardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const { user } = useAuth();
  const {
    elements,
    activeTab,
    isNew,
    background,
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
    <div className="lg:hidden sm:flex hidden sticky self-start top-28 flex-col gap-2 z-30">
      <button
        onClick={() => setEditable(false)}
        className="mr-22 mb-2 w-10 h-10 flex items-center justify-center border border-muted-light border-dashed hover:border-border hover:bg-background transition duration-300 rounded-full"
      >
        <BackIcon className="w-8 h-8" />
      </button>

      <div className="absolute top-12 flex h-115 rounded-2xl px-2 py-3 border-standard bg-muted-light shadow-2xl">
        {/* 左側側邊欄：始終顯示 */}
        <div className="flex flex-col gap-2 justify-start">
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

        {/* 浮動面板：使用 Framer Motion 達成平滑展開/收合動畫 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -10, paddingLeft: 0, paddingRight: 0, marginLeft: 0 }}
              animate={{ width: 256, opacity: 1, x: 0, paddingLeft: 20, paddingRight: 20, marginLeft: 16 }}
              exit={{ width: 0, opacity: 0, x: -10, paddingLeft: 0, paddingRight: 0, marginLeft: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="ml-3 py-3 px-5 text-center rounded-2xl border-standard bg-muted-light"
            >
                {activeTab === "background" && <BackgroundPanel />}
                {activeTab === "text" && <TextPanel />}
                {activeTab === "sticker" && <StickerPanel />}
                {activeTab === "image" && (
                  <ImagePanel onRefresh={fetchImages} isLoading={imgLoading} />
                )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 展開/收合按鈕 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 rounded-r-xl rounded-l-sm hover:bg-neutral transition self-stretch px-1 flex items-center"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowSingleRIcon className="w-4 h-4" />
          </motion.div>
        </button>
      </div>
    </div>
  );
}
