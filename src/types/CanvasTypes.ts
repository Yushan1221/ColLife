import { Timestamp, FieldValue } from "firebase/firestore";

export interface CanvasDocument {
  date: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  background: string;
  elements: CanvasElement[];
}

export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'sticker';
  content?: string;
  src?: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}
