import { useState, useRef } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import { useAuth } from "@/src/hooks/useAuth";
import { uploadUserImage } from "@/src/utils/imageOperations";
import Image from "next/image";
import UploadIcon from "../../icons/UploadIcon";

interface ImagePanelProps {
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export default function ImagePanel({ isLoading, onRefresh }: ImagePanelProps) {
  const { user } = useAuth();
  const { selectedId, addImageElement, deleteElement, userImages } =
    useCanvasStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理上傳
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      await uploadUserImage(user.uid, file);
      await onRefresh(); // 上傳成功後重新獲取列表
    } catch (error) {
      alert("圖片上傳失敗");
      console.error(error);
    } finally {
      setUploading(false);
      // 上傳後要清空input，這樣就算上傳一樣的圖片也可以觸發 onchange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 點擊圖片加入畫布
  const handleAddImage = (url: string) => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      addImageElement(url, img.width, img.height);
    };
  };

  if (isLoading && userImages.length === 0)
    return <div className="text-center py-10 opacity-50">載入圖片中...</div>;

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] p-1 custom-scrollbar">
        {/* 上傳按鈕 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-standard rounded-lg flex items-center justify-center transition min-h-[100px]
            ${uploading ? "opacity-30 cursor-wait" : "opacity-50 hover:opacity-100 hover:bg-muted-light"}`}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-border" />
          ) : (
            <UploadIcon />
          )}
          {/* 隱藏原始 input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 圖片列表 */}
        {userImages.map((image) => (
          <div
            key={image.id}
            className="group relative cursor-pointer rounded-lg p-1 transition flex items-center justify-center border-2 border-transparent border-dashed hover:border-border overflow-hidden aspect-square"
            onClick={() => handleAddImage(image.url)}
          >
            <Image
              src={image.url}
              alt={image.fileName}
              fill
              className="object-cover rounded-md group-hover:scale-105 transition duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
