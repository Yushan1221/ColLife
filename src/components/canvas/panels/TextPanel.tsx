import { useCanvasStore } from "@/src/store/useCanvasStore";
import { TextElement } from "@/src/types/CanvasTypes";
import { Slider } from "../../ui/Slider";
import FontSelector from "../../ui/FontSelector";
import ColorPicker from "../../ui/ColorPicker";

export default function TextPanel() {
  const { elements, selectedId, addTextElement, deleteElement, updateElement } =
    useCanvasStore();

  const selectedText = elements.find(
    (el) => el.id === selectedId && el.type === "text",
  ) as TextElement | undefined;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={addTextElement}
        className="py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        T 新增文字
      </button>

      {/* 字體樣式 */}
      <div className={`" min-w-0" ${!selectedText && "opacity-70"}`}>
        <p className="text-sm pb-0.5 font-bold text-start pl-0.5">字體樣式</p>
        <div className="flex flex-col gap-2  w-full p-3 border-2 border-dashed border-border rounded-md min-w-0">
          <div className="flex justify-start gap-2">
            <button
              disabled={!selectedText}
              onClick={() => {
                if (!selectedId || !selectedText) return;
                updateElement(selectedId, { isBold: !selectedText.isBold });
              }}
              className={`font-black w-6 h-6 rounded-sm transition-all duration-100 ${
                selectedText?.isBold
                  ? "bg-muted inset-shadow-sm/15 text-background"
                  : "bg-background"
              }`}
            >
              B
            </button>
            <button
              disabled={!selectedText}
              onClick={() => {
                if (!selectedId || !selectedText) return;
                updateElement(selectedId, { isItalic: !selectedText.isItalic });
              }}
              className={`font-medium italic w-6 h-6 rounded-sm transition-all duration-100 ${
                selectedText?.isItalic
                  ? "bg-muted inset-shadow-sm/15 text-background"
                  : "bg-background"
              }`}
            >
              I
            </button>
          </div>
          {/* 字型大小 */}
          <div className="flex justify-between items-center gap-2">
            <p>A</p>
            <Slider
              max={150}
              min={8}
              step={2}
              disabled={!selectedText}
              value={[selectedText?.fontSize || 0]}
              onValueChange={(val) => {
                if (!selectedId) return;
                updateElement(selectedId, { fontSize: val[0] });
              }}
            />
            <input
              className="w-8 text-center text-sm bg-background rounded-sm p-1 disabled:text-accent"
              type="number"
              disabled={!selectedText}
              value={selectedText?.fontSize || 20}
              onChange={(e) => {
                if (!selectedId) return;
                let value = Number(e.target.value);
                if (value < 0) value = 0;
                if (value > 150) value = 150;
                updateElement(selectedId, { fontSize: value });
              }}
            />
            {/* <div className="">
              <button className="">+</button>
              <button>-</button>
            </div> */}
          </div>
          {/* 字體 */}
          <FontSelector />

          {/* 調色盤 */}
          <ColorPicker
            value={selectedText?.fill}
            onChange={(color) => {
              if (!selectedId) return;
              updateElement(selectedId, { fill: color });
            }}
          />
        </div>
      </div>

      {selectedId && (
        <button
          onClick={deleteElement}
          className="p-2 bg-primary hover:bg-primary-hover w-full rounded-md"
        >
          刪除選取物件
        </button>
      )}
    </div>
  );
}
