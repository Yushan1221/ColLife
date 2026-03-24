import { create } from "zustand";
import {
  CanvasElement,
  TextElement,
  StickerElement,
} from "../types/CanvasTypes";

interface CanvasState {
  // state
  elements: CanvasElement[];
  background: string;
  isNew: boolean;
  isEditable: boolean;
  activeTab: "text" | "sticker" | "background" | "photo";
  selectedId: string | null;

  // setState
  setElements: (elements: CanvasElement[]) => void;
  setBackground: (color: string) => void;
  setIsNew: (isNew: boolean) => void;
  setEditable: (isEditable: boolean) => void;
  setActiveTab: (tab: "text" | "sticker" | "background" | "photo") => void;
  setSelectedId: (id: string | null) => void;

  // canvas operations
  addTextElement: () => void;
  addStickerElement: (svgPath: string) => void;
  selectElement: (el: CanvasElement) => void;
  updateElement: (id: string, newAttrs: Partial<CanvasElement>) => void;
  deleteElement: () => void;
  clearSelection: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // 初始值
  elements: [],
  background: "#fdfbf7",
  isNew: false,
  isEditable: false,
  activeTab: "text",
  selectedId: null,

  // 基礎設定
  setElements: (elements) => set({ elements }),
  setBackground: (background) => set({ background }),
  setIsNew: (isNew) => set({ isNew }),
  setEditable: (isEditable) => set({ isEditable }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedId: (selectedId) => set({ selectedId }),

  // canvas operations
  // 新增文字元件
  addTextElement: () =>
    set((state) => {
      const newText: TextElement = {
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

      return {
        elements: [...state.elements, newText], // 把新文字塞進陣列
        selectedId: newText.id,
        activeTab: "text",
      };
    }),

  // 新增貼紙元件
  addStickerElement: (svgPath) =>
    set((state) => {
      const newSticker: StickerElement = {
        id: "sticker-" + Date.now(),
        type: "sticker",
        src: svgPath,
        x: 50,
        y: 50,
        rotation: 0,
        scale: 0.3,
      };

      return {
        elements: [...state.elements, newSticker],
        selectedId: newSticker.id,
        activeTab: "sticker",
      };
    }),

  // 選取元件
  selectElement: (el) =>
    set({
      selectedId: el.id,
      activeTab: el.type,
    }),

  // 更新元件
  updateElement: (id, newAttrs) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...newAttrs } as CanvasElement) : el,
      ),
    })),

  // 刪除元件
  deleteElement: () =>
    set((state) => {
      if (!state.selectedId) return state;

      return {
        elements: state.elements.filter((el) => el.id !== state.selectedId),
        selectedId: null,
      };
    }),

  // 取消選取
  clearSelection: () => set({ selectedId: null }),
}));
