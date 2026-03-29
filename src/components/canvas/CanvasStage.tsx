'use client';

import { Stage, Layer, Rect } from "react-konva";
import EditableText from "@/src/components/canvas/elements/EditableText";
import Sticker from "@/src/components/canvas/elements/Sticker";
import EditableImage from "@/src/components/canvas/elements/EditableImage";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { useRef, useState, useEffect } from "react";
import {
  StickerElement,
  TextElement,
  ImageElement,
} from "@/src/types/CanvasTypes";
import { useKeyboardDelete } from "@/src/hooks/useKeyboardDelete";

// 基準畫布尺寸 scale=1
const VIRTUAL_WIDTH = 450;
const VIRTUAL_HEIGHT = 600;

export default function CanvasStage() {
  const { elements, background, clearSelection } = useCanvasStore();

  // 用來抓取外層容器的寬度
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 記錄算出來的實際寬高與縮放比例
  const [dimensions, setDimensions] = useState({
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT,
    scale: 1,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // 使用 ResizeObserver 監控容器大小變動
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const scale = width / VIRTUAL_WIDTH;
          setDimensions({
            width: width,                   // Stage 實際寬度
            height: VIRTUAL_HEIGHT * scale, // 按比例縮放的高度
            scale: scale,                   // Konva 縮放倍率
          });
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 啟用鍵盤刪除功能
  useKeyboardDelete();

  return (
    <div ref={containerRef} className="bg-background flex-1 w-full overflow-hidden">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        onMouseDown={(e) => {
          // 只有點擊到空白背景（即點擊目標是 Stage 本身）時，才取消選取
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            clearSelection();
          }
        }}
        onTouchStart={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            clearSelection();
          }
        }}
      >
        <Layer>
          <Rect width={VIRTUAL_WIDTH} height={VIRTUAL_HEIGHT} fill={background} listening={false} />
        </Layer>
        <Layer>
          {elements.map((el) => {
            if (el.type === "text") {
              return <EditableText key={el.id} element={el as TextElement} />;
            }
            if (el.type === "sticker") {
              return <Sticker key={el.id} element={el as StickerElement} />;
            }
            if (el.type === "image") {
              return <EditableImage key={el.id} element={el as ImageElement} />;
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
