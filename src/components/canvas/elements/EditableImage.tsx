import { Image as KonvaImage, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { ImageElement } from "@/src/types/CanvasTypes";
import { useRef, useEffect } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";

interface EditableImageProps {
  element: ImageElement;
}

export default function EditableImage({ element }: EditableImageProps) {
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
        width={element.width}
        height={element.height}
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
          rotateEnabled={true}
          keepRatio={true}
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
