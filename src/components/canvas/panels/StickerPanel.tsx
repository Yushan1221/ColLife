import Image from "next/image";

interface StickerPanelProps {
  onAddSticker: (svgPath: string) => void;
  onDelete: () => void;
  selectedId: string | null;
}

export default function StickerPanel({
  onAddSticker,
  onDelete,
  selectedId,
}: StickerPanelProps) {
  const stickers = [
    { name: "dancing", path: "/assets/stickers/dancing.svg" },
    { name: "dog-jump", path: "/assets/stickers/dog-jump.svg" },
    { name: "float", path: "/assets/stickers/float.svg" },
    { name: "petting", path: "/assets/stickers/petting.svg" },
    { name: "reading-side", path: "/assets/stickers/reading-side.svg" },
    { name: "reading", path: "/assets/stickers/reading.svg" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] p-1">
        {stickers.map((sticker) => (
          <div 
            key={sticker.name}
            className="cursor-pointer rounded-lg p-2 transition flex items-center justify-center border border-transparent border-dashed hover:border-border"
            onClick={() => onAddSticker(sticker.path)}
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
          onClick={onDelete} 
          className="p-2 bg-primary hover:bg-primary-hover w-full rounded-md"
        >
          刪除選取物件
        </button>
      )}
    </div>
  );
}
