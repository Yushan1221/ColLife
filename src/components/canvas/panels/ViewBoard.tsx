import PenToolIcon from "../../icons/PenToolIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import CalendarIcon from "../../icons/CalendarIcon";
import { useRouter, useParams } from "next/navigation";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import DeleteIcon from "../../icons/DeleteIcon";
import { deleteCanvas } from "@/src/utils/canvasOperations";
import { useAuth } from "@/src/hooks/useAuth";

export default function ViewBoard() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { setEditable, stageRef } = useCanvasStore();

  const date = params.date as string;

  const pushToCalender = () => {
    router.push("/calendar");
  };

  const handleExport = () => {
    if (!stageRef) {
      alert("尚未準備好畫布，請稍後再試。");
      return;
    }

    // 取得圖片資料 URL (預設為 PNG)
    const dataURL = stageRef.toDataURL({
      pixelRatio: 2, // 提高解析度
    });

    // 建立一個暫時的下載連結
    const link = document.createElement("a");
    link.download = `collife-${date}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!user || !date) return;

    const confirmDelete = window.confirm("確定要刪除這天的紀錄嗎？此動作無法復原。");
    if (!confirmDelete) return;

    try {
      await deleteCanvas(user.uid, date);
      alert("刪除成功！");
      router.push("/calendar");
    } catch (error) {
      console.error("刪除失敗:", error);
      alert("刪除失敗，請稍後再試。");
    }
  };

  const cssButton =
    "group w-28 h-28 rounded-2xl shadow transition-colors duration-300 hover:shadow-md flex justify-center items-center";

  const cssBorder =
    "w-24 h-24 border border-foreground border-dashed rounded-xl flex flex-col justify-center items-center gap-2";

  return (
    <div className="lg:flex hidden flex-1 justify-center items-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-5">
        <button onClick={() => setEditable(true)} className={`${cssButton} bg-primary hover:bg-primary-hover`}>
          <div className={cssBorder}>
            <PenToolIcon />
            <div className="text-sm">Edit</div>
          </div>
        </button>
        <button onClick={handleExport} className={`${cssButton} bg-secondary hover:bg-secondary-hover`}>
          <div className={cssBorder}>
            <DownloadIcon />
            <div className="text-sm">Export</div>
          </div>
        </button>
        <button onClick={pushToCalender} className={`${cssButton} bg-muted hover:bg-acent`}>
          <div className={cssBorder}>
            <CalendarIcon />
            <div className="text-sm">Calendar</div>
          </div>
        </button>
        <button onClick={handleDelete} className={`${cssButton} bg-error hover:bg-error-hover`}>
          <div className={cssBorder}>
            <DeleteIcon />
            <div className="text-sm">Delete</div>
          </div>
        </button>
      </div>
    </div>
  );
}
