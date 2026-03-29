"use client";

import {
  Stage,
  Layer,
  Text,
  Rect,
  Group,
  Image as KonvaImage,
} from "react-konva";
import { useRef, useState, useEffect } from "react";
import useImage from "use-image";

const DESKTOP_VIRTUAL = { w: 1200, h: 700 };
const MOBILE_VIRTUAL = { w: 600, h: 1000 };

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 載入所有圖片資源
  const [gridImg] = useImage("/assets/home/grid.svg");
  const [blockBrownImg] = useImage("/assets/home/block_light_brown.svg");
  const [circleYellowImg] = useImage("/assets/home/circle_yellow.svg");
  const [clipImg] = useImage("/assets/home/clip.svg");
  const [tapeImg] = useImage("/assets/home/office_scotch_tape_1.svg");
  const [brushImg] = useImage("/assets/home/school_brush.svg");
  const [face] = useImage("/assets/home/face_11.svg");
  const [leaf] = useImage("/assets/home/food_arugula.svg");

  const [dimensions, setDimensions] = useState({
    width: DESKTOP_VIRTUAL.w,
    height: DESKTOP_VIRTUAL.h,
    scale: 1,
    isMobile: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0) {
          const isMobileMode = width < 768;
          const activeV = isMobileMode ? MOBILE_VIRTUAL : DESKTOP_VIRTUAL;
          
          const scale = Math.min(
            width / activeV.w,
            height / activeV.h,
          );
          
          setDimensions({
            width: width,
            height: height,
            scale: scale,
            isMobile: isMobileMode,
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activeV = dimensions.isMobile ? MOBILE_VIRTUAL : DESKTOP_VIRTUAL;

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
        x={(dimensions.width - activeV.w * dimensions.scale) / 2}
        y={(dimensions.height - activeV.h * dimensions.scale) / 2}
      >
        <Layer>
          {/* 背景格線 */}
          {gridImg && (
            <KonvaImage
              image={gridImg}
              x={dimensions.isMobile ? -20 : 50}
              y={dimensions.isMobile ? 180 : 150}
              width={dimensions.isMobile ? 400 : 600}
              height={dimensions.isMobile ? 400 : 450}
              opacity={0.8}
              draggable
            />
          )}

          {/* 裝飾性色塊 */}
          {blockBrownImg && (
            <KonvaImage
              image={blockBrownImg}
              x={dimensions.isMobile ? 40 : 550}
              y={dimensions.isMobile ? 950 : 620}
              width={dimensions.isMobile ? 1100 : 900}
              height={350}
              rotation={dimensions.isMobile ? -60 : -40}
              draggable
            />
          )}

          {/* 圓形裝飾 */}
          {circleYellowImg && (
            <KonvaImage
              image={circleYellowImg}
              x={dimensions.isMobile ? -50 : -100}
              y={dimensions.isMobile ? 150 : 100}
              width={400}
              height={250}
              scaleX={dimensions.isMobile ? 1 : 1.7}
              scaleY={dimensions.isMobile ? 1 : 1.7}
              draggable
            />
          )}

          {face && (
            <KonvaImage
              image={face}
              x={dimensions.isMobile ? 10 : 100}
              y={dimensions.isMobile ? 220 : 180}
              width={dimensions.isMobile ? 120 : 250}
              height={dimensions.isMobile ? 120 : 250}
              scaleX={-1}
              offsetX={dimensions.isMobile ? 180 : 250}
              draggable
            />
          )}

          {leaf && (
            <KonvaImage
              image={leaf}
              x={dimensions.isMobile ? 200 : 50}
              y={dimensions.isMobile ? 250 : 430}
              width={dimensions.isMobile ? 120 : 250}
              height={dimensions.isMobile ? 100 : 200}
              scaleX={dimensions.isMobile ? 1 : -1}
              offsetX={dimensions.isMobile ? 0 : 250}
              draggable
            />
          )}
        </Layer>

        {/* 文字層 */}
        <Layer>
          <Group 
            x={dimensions.isMobile ? 75 : 450} 
            y={dimensions.isMobile ? 400 : 180} 
            draggable
          >
            <Rect
              width={dimensions.isMobile ? 460 : 650}
              height={dimensions.isMobile ? 140 : 180}
              fill="#A4AF83"
              opacity={0.9}
              cornerRadius={10}
            />
            <Text
              text="ColLife"
              fontSize={dimensions.isMobile ? 90 : 130}
              fontStyle="400"
              fontFamily="Edu QLD Hand"
              fill="#674636"
              x={dimensions.isMobile ? 50 : 130}
              y={dimensions.isMobile ? 15 : 20}
            />
          </Group>
          
          <Group 
            x={dimensions.isMobile ? 120 : 500} 
            y={dimensions.isMobile ? 560 : 370} 
            draggable
          >
            <Rect 
              width={dimensions.isMobile ? 400 : 500} 
              height={dimensions.isMobile ? 55 : 65} 
              fill="#B66F54" 
              opacity={1} 
              cornerRadius={8} 
            />
            <Text
              text="自由佈局的手帳設計平台"
              fontSize={dimensions.isMobile ? 22 : 28}
              fill="#FDFBF7"
              x={dimensions.isMobile ? 80 : 150}
              y={dimensions.isMobile ? 16 : 16}
            />
          </Group>
        </Layer>

        <Layer>
          {/* 右側筆觸 */}
          {brushImg && (
            <KonvaImage
              image={brushImg}
              x={dimensions.isMobile ? 450 : 1000}
              y={dimensions.isMobile ? 300 : 80}
              width={dimensions.isMobile ? 130 : 150}
              height={dimensions.isMobile ? 450 : 580}
              rotation={dimensions.isMobile ? 4 : 12}
              draggable
            />
          )}

          {/* 迴紋針與膠帶 */}
          {clipImg && (
            <KonvaImage
              image={clipImg}
              x={dimensions.isMobile ? 100 : 865}
              y={dimensions.isMobile ? 630 : 530}
              width={dimensions.isMobile ? 30 : 40}
              height={dimensions.isMobile ? 80 : 100}
              rotation={dimensions.isMobile ? 45 : 120}
              draggable
            />
          )}
          {tapeImg && (
            <KonvaImage
              image={tapeImg}
              x={dimensions.isMobile ? 130 : 400}
              y={dimensions.isMobile ? 570 : 500}
              width={dimensions.isMobile ? 180 : 250}
              height={dimensions.isMobile ? 120 : 170}
              rotation={dimensions.isMobile ? 30 : -10}
              draggable
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
