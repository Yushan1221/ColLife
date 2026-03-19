import { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { StickerElement } from "@/src/types/CanvasTypes";
import { useCanvasStore } from "@/src/store/useCanvasStore";

interface StickerProps {
  element: StickerElement;
}

export default function Sticker({ element }: StickerProps) {
  const { isEditable, selectedId, selectElement, updateElement } =
    useCanvasStore();
  const isSelected = selectedId === element.id;

  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(element.src || "");

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        scaleX={element.scale}
        scaleY={element.scale}
        draggable={isEditable}
        onClick={() => selectElement(element)}
        onTap={() => selectElement(element)}
        onDragEnd={(e) => {
          updateElement(element.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();

          updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scale: scaleX,
          });
        }}
      />
      {isEditable && isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // 限制最小縮放
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
