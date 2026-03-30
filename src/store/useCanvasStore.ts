import { create } from "zustand";
import {
  CanvasElement,
  TextElement,
  StickerElement,
  ImageElement,
} from "../types/CanvasTypes";
import { CanvasState, CanvasStore } from "../types/CanvasStoreTypes";

// 初始值
const initialCanvasState: CanvasState = {
  elements: [],
  userImages: [],
  background: "#fdfbf7",
  isNew: true,
  isEditable: false,
  activeTab: "text",
  selectedId: null,
  stageRef: null,
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  ...initialCanvasState,

  // 基礎設定
  setElements: (elements) => set({ elements }),
  setUserImages: (userImages) => set({ userImages }),
  setBackground: (background) => set({ background }),
  setIsNew: (isNew) => set({ isNew }),
  setEditable: (isEditable) => set({ isEditable }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setStageRef: (stageRef) => set({ stageRef }),

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

  // 新增圖片元件
  addImageElement: (url, width, height) =>
    set((state) => {
      const newImage: ImageElement = {
        id: "image-" + Date.now(),
        type: "image",
        src: url,
        x: 50,
        y: 50,
        rotation: 0,
        width: width > 300 ? 300 : width, // 限制初始顯示寬度
        height: width > 300 ? (height * 300) / width : height,
        scale: 1,
        cropX: 0,
        cropY: 0,
        cropWidth: width,
        cropHeight: height,
      };

      return {
        elements: [...state.elements, newImage],
        selectedId: newImage.id,
        activeTab: "image",
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

  // 複製元素
  copyElement: () =>
    set((state) => {
      const elementToCopy = state.elements.find((el) => el.id === state.selectedId);
      if (!elementToCopy) return state;

      // 產生新 ID 並稍微偏移位置
      const newId = `${elementToCopy.type}-${Date.now()}`;
      const newElement: CanvasElement = {
        ...elementToCopy,
        id: newId,
        x: elementToCopy.x + 20,
        y: elementToCopy.y + 20,
      };

      return {
        elements: [...state.elements, newElement],
        selectedId: newId,
      };
    }),

  // 取消選取
  clearSelection: () => set({ selectedId: null }),

  // 重製狀態回初始值
  resetStore: () => set(initialCanvasState),

  // 置頂
  bringToFront: (id: string) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      // 如果找不到，或者已經在最頂層，就不做事
      if (index === -1 || index === state.elements.length - 1) return state;

      const newElements = [...state.elements];
      const [target] = newElements.splice(index, 1); // 把目標抽出來
      newElements.push(target); // 塞到最後面

      return { elements: newElements };
    }),

  // 置底
  sendToBack: (id: string) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      // 如果找不到，或者已經在最底層，就不做事
      if (index <= 0) return state;

      const newElements = [...state.elements];
      const [target] = newElements.splice(index, 1); // 把目標抽出來
      newElements.unshift(target); // 塞到最前面

      return { elements: newElements };
    }),

  // 上移一層
  bringForward: (id: string) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      // 如果找不到，或者已經在最頂層，無法再上移
      if (index === -1 || index === state.elements.length - 1) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index + 1]] = [
        newElements[index + 1],
        newElements[index],
      ];

      return { elements: newElements };
    }),

  // 下移一層
  sendBackward: (id: string) =>
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      // 如果找不到，或者已經在最底層，無法再下移
      if (index <= 0) return state;

      const newElements = [...state.elements];
      [newElements[index], newElements[index - 1]] = [
        newElements[index - 1],
        newElements[index],
      ];

      return { elements: newElements };
    }),
}));
