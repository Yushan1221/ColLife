import PenToolIcon from "../../icons/PenToolIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import CalendarIcon from "../../icons/CalendarIcon";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "@/src/store/useCanvasStore";

export default function ViewBoard() {

  const router = useRouter();
  const { setEditable } = useCanvasStore();

  const pushToCalender = () => {
    router.push("/calendar");
  };

  const cssButton = "w-20 h-20 gap-2 rounded-2xl bg-muted hover:border-border hover:bg-muted-light transition-colors border-2 border-dashed border-muted duration-300 flex flex-col justify-center items-center";
  
  return (
    <div className="flex flex-1 justify-center items-center gap-5">
      <button 
        onClick={() => setEditable(true)} 
        className={cssButton}
      >
        <PenToolIcon />
        <div className="text-sm">編輯</div>
      </button>
      <button className={cssButton}>
        <DownloadIcon />
        <div className="text-sm">匯出</div>
      </button>
      <button 
        onClick={pushToCalender} 
        className={cssButton}
      >
        <CalendarIcon />
        <div className="text-sm">月曆</div>
      </button>
    </div>
  );
}
