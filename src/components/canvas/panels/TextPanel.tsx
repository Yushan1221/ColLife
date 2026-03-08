interface TextPanelProps {
  onAddText: () => void;
  onDelete: () => void;
  selectedId: string | null;
}

export default function TextPanel({
  onAddText,
  onDelete,
  selectedId,
}: TextPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onAddText}
        className="py-2 w-full bg-primary hover:bg-primary-hover rounded-md"
      >
        T 新增文字
      </button>

      { selectedId && (
      <button onClick={onDelete} className="p-2 bg-primary hover:bg-primary-hover w-full rounded-md">
        刪除選取物件
      </button>
      )}
    </div>
  );
}
