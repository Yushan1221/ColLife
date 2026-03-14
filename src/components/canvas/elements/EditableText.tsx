"use client";

import { TextElement } from "@/src/types/CanvasTypes";
import { Text, Transformer } from "react-konva";
import { useRef, useEffect, useState, useCallback } from "react";
import Konva from "konva";
import TextEditor from "./TextEditor";

interface TextElementProps {
  element: TextElement;
  isSelected: boolean;
  isEditable: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<TextElement>) => void;
}

export default function EditableText({
  element,
  isSelected,
  isEditable,
  onSelect,
  onChange,
}: TextElementProps) {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 當選取狀態改變時，手動將 Transformer 綁定到 Text 節點
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && !isEditing) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isEditing]);

  const handleDblClick = useCallback(() => {
    if (isEditable) {
      setIsEditing(true);
    }
  }, [isEditable]);

  const handleTextChange = useCallback((newText: string) => {
    onChange({ content: newText });
  }, [onChange]);

  // 算 fontstyle = "bold", "italic, "bold italic", "normal"
  const currentFontStyle =
    [element.isBold ? "bold" : "", element.isItalic ? "italic" : ""]
      .filter(Boolean)
      .join(" ") || "normal";

  return (
    <>
      <Text
        ref={shapeRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        width={element.width || 200}
        text={element.content}
        fontSize={element.fontSize || 20}
        fontStyle={currentFontStyle}
        fontFamily={element.fontFamily || "sans-serif"}
        fill={element.fill}
        draggable={isEditable && !isEditing}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        visible={!isEditing}
        // 拖拽結束更新位置
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const newWidth = Math.max(30, node.width() * scaleX);

          node.setAttrs({
            width: newWidth,
            scaleX: 1,
          });
        }}
        // 縮放/旋轉結束更新屬性
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width(),
          });
        }}
      />

      {/* 按兩下顯示文字編輯器 */}
      {isEditable && isEditing && (
        <TextEditor
          textRef={shapeRef}
          onChange={handleTextChange}
          onClose={() => setIsEditing(false)}
        />
      )}

      {/* 按一下顯示 Transformer */}
      {isEditable && isSelected && !isEditing && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
        />
      )}
    </>
  );
}
