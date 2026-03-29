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
    return (
      <div className="text-center py-10 opacity-50">Loading Images...</div>
    );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-1">
      <div className="grid grid-cols-2 gap-4">
        {/* 上傳按鈕 */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-standard rounded-lg flex items-center justify-center transition aspect-square
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
            className="group relative cursor-pointer rounded-lg transition flex items-center justify-center border-2 border-transparent hover:border-standard duration-300 overflow-hidden aspect-square"
            onClick={() => handleAddImage(image.url)}
          >
            <Image
              src={image.url}
              alt={image.fileName}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
