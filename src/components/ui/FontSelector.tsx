import { FONT_OPTIONS, FontOption } from "@/src/lib/constants/fonts";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { TextElement } from "@/src/types/CanvasTypes";
import { useState, useRef, useEffect } from "react";

export default function FontSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { elements, selectedId, updateElement } = useCanvasStore();

  const selectedText = elements.find(
    (el) => el.id === selectedId && el.type === "text",
  ) as TextElement | undefined;

  const currentFontLabel =
    FONT_OPTIONS.find((f) => f.value === selectedText?.fontFamily)?.label ||
    "選擇字型...";

  // 監聽點擊外部
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 更新字體
  const updateFontStyle = (font: FontOption) => {
    if (!selectedId) return;
    updateElement(selectedId, { fontFamily: font.value });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <button
        disabled={!selectedText}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ fontFamily: selectedText?.fontFamily }}
        className="disabled:opacity-70 flex items-center justify-between w-full overflow-hidden truncate text-left pl-3 pr-2 py-1 bg-background border-2 border-dashed rounded-md "
      >
        <span className="truncate flex-1">{currentFontLabel}</span>
        <svg
          className={`text-acent w-4 h-4 ml-2 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 91 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45.4294 49.6574C49.7395 44.2098 53.604 39.3621 57.4357 34.4856C63.7103 26.4986 69.8405 18.3922 76.2864 10.5477C78.9741 7.27712 82.2998 4.52502 85.3833 1.58791C86.7071 0.326427 88.4109 -0.774937 90.0065 0.720856C91.7786 2.38073 90.6629 4.19232 89.2846 5.57785C74.4514 20.4826 64.2741 38.9336 51.3705 55.3092C47.5677 60.1346 44.3654 60.7634 39.6608 56.6777C38.1526 55.4129 36.7389 54.0397 35.4308 52.569C26.2532 41.8805 16.9876 31.2622 8.06665 20.3624C5.20239 16.8628 3.23017 12.6177 1.00124 8.62848C0.621879 7.94851 0.775416 6.15672 1.08521 6.0504C2.22264 5.65659 3.88641 5.22532 4.71077 5.7727C7.95308 7.92746 11.3608 10.0744 13.9593 12.9097C20.2312 19.7534 26.0667 26.9954 32.111 34.0484C35.6657 38.1971 39.2913 42.2848 42.8663 46.4165C43.6467 47.3202 44.3523 48.2929 45.4294 49.6574Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 pr-0.5 py-2 w-full border-2 border-border border-dashed rounded-md bg-background shadow-lg overflow-hidden">
          <ul className="max-h-60 overflow-y-auto pr-0.5 pl-1 overflow-x-hidden cursor-default custom-scrollbar">
            {FONT_OPTIONS.map((font) => (
              <li
                key={font.value}
                style={{ fontFamily: font.value }}
                onClick={() => updateFontStyle(font)}
                className={`flex items-center justify-between w-full text-left px-2 py-1 rounded-sm cursor-pointer transition duration-200
                  ${
                    selectedText?.fontFamily === font.value
                      ? "bg-muted-light"
                      : "hover:bg-muted-light"
                  }`}
              >
                <span className="truncate flex-1">{font.label}</span>
                {/* 勾勾 */}
                {selectedText?.fontFamily === font.value && (
                  <svg
                    className="pointer-events-none text-acent w-3 h-3 ml-2 "
                    viewBox="0 0 130 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.7162 81.5027C36.3213 79.9761 37.2031 79.2039 38.0103 78.3599C63.8892 51.3046 92.2309 26.9469 120.74 2.77407C121.817 1.86111 122.921 0.696462 124.196 0.3701C125.733 -0.0238104 128.241 -0.282655 128.928 0.552804C129.852 1.67765 130.015 4.12286 129.452 5.60109C128.782 7.35947 127.15 8.86542 125.669 10.1822C116.833 18.0391 107.749 25.6258 99.0678 33.6462C80.9213 50.4165 62.8904 67.3116 44.9751 84.3312C37.125 91.7736 34.1038 92.075 26.8803 84.1228C22.1253 78.8861 7.77509 61.237 3.38035 55.6767C2.75974 54.8123 2.20692 53.9011 1.72689 52.9513C0.732118 51.1915 0.0876263 49.254 2.05727 47.8895C4.25215 46.3708 5.81043 47.9557 7.11073 49.606C8.42738 51.2769 9.55004 53.1127 10.9598 54.6962C15.336 59.6122 29.9896 76.32 34.7162 81.5027Z"
                      fill="black"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
