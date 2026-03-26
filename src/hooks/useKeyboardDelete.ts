import { useEffect, useCallback } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";

export const useKeyboardDelete = () => {
  const { isEditable, selectedId, deleteElement } = useCanvasStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isEditable || !selectedId) return;

      // 如果使用者正在輸入文字，不觸發刪除物件
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // 偵測刪除鍵
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteElement();
      }
    },
    [isEditable, selectedId, deleteElement]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
