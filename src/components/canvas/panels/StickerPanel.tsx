import Image from "next/image";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { STICKERS } from "@/src/lib/constants/stickers";

export default function StickerPanel() {
  const {selectedId, addStickerElement, deleteElement} = useCanvasStore(); 

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] p-1">
        {STICKERS.map((sticker) => (
          <div 
            key={sticker.name}
            className="cursor-pointer rounded-lg p-2 transition flex items-center justify-center border border-transparent border-dashed hover:border-border"
            onClick={() => addStickerElement(sticker.path)}
          >
            <Image 
              src={sticker.path} 
              alt={`${sticker.name}-sticker`} 
              width={80} 
              height={80}
              className="object-contain"
            />
          </div>
        ))}
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
