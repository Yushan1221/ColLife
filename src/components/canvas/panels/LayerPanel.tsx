import { useCanvasStore } from "@/src/store/useCanvasStore";
import Image from "next/image";
import DeleteIcon from "../../icons/DeleteIcon";
import CopyIcon from "../../icons/CopyIcon";

export default function LayerPanel() {
  const {
    selectedId,
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack,
    deleteElement,
    copyElement
  } = useCanvasStore();

  return (
    <div className={`${!selectedId && "opacity-80"} border-standard rounded-2xl w-20 py-3 px-2 grid grid-cols-2 gap-1`}>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) bringToFront(selectedId);
        }}
        className="disabled:bg-acent aspect-square w-full bg-secondary hover:bg-secondary-hover transition rounded-md flex justify-center items-center"
        title="置頂"
      >
        <Image
          src="/bring_to_front.png"
          alt="Bring to Front"
          width={18}
          height={18}
        />
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) bringForward(selectedId);
        }}
        className="disabled:bg-acent aspect-square w-full bg-secondary hover:bg-secondary-hover transition rounded-md flex justify-center items-center"
        title="上移一層"
      >
        <Image
          src="/bring_forward.png"
          alt="Bring Forward"
          width={18}
          height={18}
        />
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) sendBackward(selectedId);
        }}
        className="disabled:bg-acent aspect-square w-full bg-secondary hover:bg-secondary-hover transition rounded-md flex justify-center items-center"
        title="下移一層"
      >
        <Image
          src="/send_backward.png"
          alt="Send Backward"
          width={18}
          height={18}
        />
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) sendToBack(selectedId);
        }}
        className="disabled:bg-acent aspect-square w-full bg-secondary hover:bg-secondary-hover transition rounded-md flex justify-center items-center"
        title="置底"
      >
        <Image
          src="/send_to_back.png"
          alt="Send to Back"
          width={18}
          height={18}
        />
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) copyElement();
        }}
        className="disabled:bg-acent aspect-square w-full bg-secondary hover:bg-secondary-hover transition rounded-md flex justify-center items-center"
        title="複製"
      >
        <CopyIcon className="w-4 h-4" />
      </button>
      <button
        disabled={!selectedId}
        onClick={() => {
          if (selectedId) deleteElement();
        }}
        className="disabled:bg-acent aspect-square w-full bg-error hover:bg-error-hover transition rounded-md flex justify-center items-center"
        title="刪除"
      >
        <DeleteIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
