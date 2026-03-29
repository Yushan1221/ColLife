import ColorPicker from "../../ui/ColorPicker";
import { useCanvasStore } from "@/src/store/useCanvasStore";

export default function BackgroundPanel () {
  const {background, setBackground} = useCanvasStore();

  return (
    <div className="text-start">
      <p className="text-sm px-1 py-1">Background Color</p>
      <ColorPicker value={background} onChange={(color) => setBackground(color)}/>
    </div>
  )
}