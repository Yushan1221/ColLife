import Image from "next/image";
import { useState } from "react";
import { useCanvasStore } from "@/src/store/useCanvasStore";
import {
  BUILDINGS,
  PLANTS,
  PERSONS,
  SHAPES,
  OTHERS
} from "@/src/lib/constants/stickers";
import BankIcon from "../../icons/BankIcon";
import UserMaleIcon from "../../icons/UserMaleIcon";
import ShapeIcon from "@/src/components/icons/ShapeIcon";
import LeafIcon from "../../icons/LeafIcon";
import SmilingIcon from "../../icons/SmilingIcon";

const ASSET_CATEGORIES = [
  { id: "persons", label: "Persons", data: PERSONS, Icon: UserMaleIcon },
  { id: "buildings", label: "Buildings", data: BUILDINGS, Icon: BankIcon },
  { id: "plants", label: "Plants", data: PLANTS, Icon: LeafIcon },
  { id: "shapes", label: "Shapes", data: SHAPES, Icon: ShapeIcon },
  { id: "others", label: "Others", data: OTHERS, Icon: SmilingIcon },
];

export default function StickerPanel() {
  const { addStickerElement } = useCanvasStore();
  const [currentAssetId, setCurrentAssetId] = useState("persons");

  const currentCategory =
    ASSET_CATEGORIES.find((cat) => cat.id === currentAssetId) ||
    ASSET_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-2 h-full justify-start">
      {/* 種類選單 */}
      <div className="flex gap-1 justify-start p-1 rounded-md bg-muted shadow-sm">
        {ASSET_CATEGORIES.map((category) => {
          const IconComponent = category.Icon;
          return (
            <button
              key={category.id}
              className={`flex-1 p-1 rounded-md transition hover:shadow-md active:bg-secondary-hover ${
                currentAssetId === category.id
                  ? "bg-secondary shadow"
                  : "bg-transparent"
              }`}
              onClick={() => setCurrentAssetId(category.id)}
            >
              <div
                title={category.label}
                className="flex justify-center items-center p-1 rounded-sm border border-dashed border-foreground"
              >
                <IconComponent className="w-5 h-6" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <div className="grid grid-cols-2 gap-4">
          {currentCategory.data.map((item) => (
            <div
              key={item.name}
              className="group relative cursor-pointer rounded-lg transition flex items-center justify-center border-2 border-transparent hover:border-standard duration-300 overflow-hidden aspect-square"
              onClick={() => addStickerElement(item.path)}
            >
              <Image
                src={item.path}
                alt={`${item.name}-${currentCategory.id}`}
                fill
                className="object-contain group-hover:scale-110 transition duration-500 p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
