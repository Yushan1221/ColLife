import ColorPicker from "../../ui/ColorPicker";
import { useCanvasStore } from "@/src/store/useCanvasStore";

export default function BackgroundPanel () {
  const {background, setBackground} = useCanvasStore();

  return (
    <div className="text-start">
      <p className="text-sm font-bold px-1">背景顏色</p>
      <ColorPicker value={background} onChange={(color) => setBackground(color)}/>
    </div>
  )
}