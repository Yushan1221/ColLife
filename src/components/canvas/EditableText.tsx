'use client';

import React, { useRef, useEffect } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '@/src/types/CanvasTypes';

interface EditableTextProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasElement>) => void;
  onDblClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  element, 
  isSelected, 
  onSelect, 
  onChange, 
  onDblClick 
}) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // 當選取狀態改變時，手動將 Transformer 綁定到 Text 節點
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // 確保節點已存在於 Stage 中
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        scaleX={element.scale}
        scaleY={element.scale}
        text={element.content}
        fontSize={20}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDblClick}
        // 拖拽結束更新位置
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
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
            scale: node.scaleX(), 
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // 限制最小縮放
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default EditableText;
