import { useCanvasStore } from "@/src/store/useCanvasStore";
import { TextElement } from "@/src/types/CanvasTypes";
import { Slider } from "../../ui/slider";

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

      {/* 字型大小 */}
      <div className="flex justify-between items-center gap-2">
        <p className="text-sm">T</p>
        {/* <input
          type="range"
          disabled={!selectedText}
          min={8}
          max={150}
          step={2}
          value={selectedText?.fontSize || 20}
          onChange={(e) => {
            if (!selectedId) return;
            updateElement(selectedId, { fontSize: Number(e.target.value) });
          }}
          className="accent-primary flex-1"
        /> */}
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
          className="disabled:opacity-50"
        />
        <p className="text-lg">T</p>
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
