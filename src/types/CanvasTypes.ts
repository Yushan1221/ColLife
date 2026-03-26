import { Timestamp, FieldValue } from "firebase/firestore";

export interface CanvasDocument {
  date: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  background: string;
  elements: CanvasElement[];
}

// 所有物件都有的共同屬性
interface BaseElement {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

// 文字專屬屬性
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  width: number;
  fill: string;
  isBold: boolean;
  isItalic: boolean;
  fontFamily: string;
}

// 素材專屬屬性
export interface StickerElement extends BaseElement {
  type: 'sticker';
  src: string;
  scale: number;
}

// 圖片專屬型態
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
  scale: number;

  // 裁切屬性
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

// 最終統一使用的型別
export type CanvasElement = TextElement | StickerElement | ImageElement;

