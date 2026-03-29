import { useCanvasStore } from "@/src/store/useCanvasStore";
import FileIcon from "../../icons/FileIcon";
import PencilIcon from "../../icons/PencilIcon";
import PhotoIcon from "../../icons/PhotoIcon";
import ShapeIcon from "../../icons/ShapeIcon";
import LayerIcon from "../../icons/LayerIcon";

export default function PanelSwitcher() {
  const { activeTab, setActiveTab } = useCanvasStore();

  const cssButton =
    "group flex justify-center items-center w-12 h-12 hover:bg-primary hover:shadow:md rounded-md font-bold transition duration-200";
  const cssIcon =
    "w-10 h-10 p-2 border border-dashed rounded-sm border-foreground transition duration-200";

  return (
    <div className="flex flex-col justify-center items-center py-3 gap-3 w-20 border-2 border-dashed border-border rounded-2xl">
      {/* 背景 */}
      <button
        onClick={() => setActiveTab("background")}
        className={`${cssButton} ${activeTab === "background" ? "bg-primary shadow" : "bg-muted"}`}
      >
        <FileIcon className={cssIcon} />
      </button>
      {/* 文字框 */}
      <button
        onClick={() => setActiveTab("text")}
        className={`${cssButton} ${activeTab === "text" ? "bg-primary shadow" : "bg-muted"}`}
      >
        <PencilIcon className={cssIcon} />
      </button>
      {/* 素材 */}
      <button
        onClick={() => setActiveTab("sticker")}
        className={`${cssButton} ${activeTab === "sticker" ? "bg-primary shadow" : "bg-muted"}`}
      >
        <ShapeIcon className={cssIcon} />
      </button>
      {/* 照片 */}
      <button
        onClick={() => setActiveTab("image")}
        className={`${cssButton} ${activeTab === "image" ? "bg-primary shadow" : "bg-muted"}`}
      >
        <PhotoIcon className={cssIcon} />
      </button>
    </div>
  );
}
