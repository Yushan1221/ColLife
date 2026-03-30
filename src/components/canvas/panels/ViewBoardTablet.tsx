import PenToolIcon from "../../icons/PenToolIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import CalendarIcon from "../../icons/CalendarIcon";
import { useRouter, useParams } from "next/navigation";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import DeleteIcon from "../../icons/DeleteIcon";
import { deleteCanvas } from "@/src/utils/canvasOperations";
import { useAuth } from "@/src/hooks/useAuth";

export default function ViewBoardTablet() {
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

    const dataURL = stageRef.toDataURL({
      pixelRatio: 2,
    });

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
    "group p-1 rounded-lg shadow transition-colors duration-300 hover:shadow-md flex justify-center items-center";

  const cssBorder =
    "sm:px-3 sm:py-2 px-2 py-1 border border-foreground border-dashed rounded-md flex items-center sm:gap-2 gap-1";

  return (
    <div className="z-20 lg:hidden flex flex-1 justify-center items-center sm:gap-2 gap-1 flex-wrap">
        <button onClick={() => setEditable(true)} className={`${cssButton} bg-primary hover:bg-primary-hover sm:block hidden`}>
          <div className={cssBorder}>
            <PenToolIcon className="w-4 h-4" />
            <div className="sm:text-sm text-xs font-medium">Edit</div>
          </div>
        </button>
        <button onClick={handleExport} className={`${cssButton} bg-secondary hover:bg-secondary-hover`}>
          <div className={cssBorder}>
            <DownloadIcon className="w-4 h-4" />
            <div className="sm:text-sm text-xs font-medium">Export</div>
          </div>
        </button>
        <button onClick={pushToCalender} className={`${cssButton} bg-muted hover:bg-acent`}>
          <div className={cssBorder}>
            <CalendarIcon className="w-4 h-4" />
            <div className="sm:text-sm text-xs font-medium">Calendar</div>
          </div>
        </button>
        <button onClick={handleDelete} className={`${cssButton} bg-error hover:bg-error-hover`}>
          <div className={cssBorder}>
            <DeleteIcon className="w-4 h-4" />
            <div className="sm:text-sm text-xs font-medium">Delete</div>
          </div>
        </button>
    </div>
  );
}
