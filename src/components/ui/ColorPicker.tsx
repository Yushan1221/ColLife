import { VINTAGE_COLOR } from "@/src/lib/constants/colors";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="w-full min-w-0">
      <ul className="grid grid-cols-4 gap-2 p-2 border-standard rounded-md">
        {VINTAGE_COLOR.map((color, index) => (
          <li
            key={`${color}-${index}`}
            className={`w-full h-5 rounded-sm hover:scale-110 transition ring-2 ring-acent
            ${value === color && "ring-2 ring-acent ring-offset-1"}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          ></li>
        ))}
      </ul>
    </div>
  );
}
