import { CanvasElement } from "./CanvasTypes";

export interface CanvasState {
  // state
  elements: CanvasElement[];
  userImages: { id: string; url: string; fileName: string }[];
  background: string;
  isNew: boolean;
  isEditable: boolean;
  activeTab: "text" | "sticker" | "background" | "image";
  selectedId: string | null;
  stageRef: any | null;
}

export interface CanvasActions {
  // setState
  setElements: (elements: CanvasElement[]) => void;
  setUserImages: (
    images: { id: string; url: string; fileName: string }[],
  ) => void;
  setBackground: (color: string) => void;
  setIsNew: (isNew: boolean) => void;
  setEditable: (isEditable: boolean) => void;
  setActiveTab: (
    tab: "text" | "sticker" | "background" | "image",
  ) => void;
  setSelectedId: (id: string | null) => void;
  setStageRef: (ref: any) => void;

  // canvas operations
  addTextElement: () => void;
  addStickerElement: (svgPath: string) => void;
  addImageElement: (url: string, width: number, height: number) => void;
  selectElement: (el: CanvasElement) => void;
  updateElement: (id: string, newAttrs: Partial<CanvasElement>) => void;
  copyElement: () => void;
  deleteElement: () => void;
  clearSelection: () => void;

  // reset
  resetStore: () => void;

  // layers actions
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
}

export type CanvasStore = CanvasState & CanvasActions;
