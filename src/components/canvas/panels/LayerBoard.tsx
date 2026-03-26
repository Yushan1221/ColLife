import { useCanvasStore } from "@/src/store/useCanvasStore";

export default function LayerPanel() {
  const { selectedId, bringForward, bringToFront, sendBackward, sendToBack } = useCanvasStore(); 

  return (
    <div className="flex flex-col gap-3">
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) bringToFront(selectedId);
        }}
        className="disabled:bg-acent py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        置頂
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) bringForward(selectedId);
        }}
        className="disabled:bg-acent py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        上移一層
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) sendBackward(selectedId);
        }}
        className="disabled:bg-acent py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        下移一層
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) sendToBack(selectedId);
        }}
        className="disabled:bg-acent py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        置底
      </button>
    </div>
  );
}