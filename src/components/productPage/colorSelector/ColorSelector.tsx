import { useState } from "react";
import type { ProductColorVariant } from "../../../types/productMedia";
import "./ColorSelector.css";

interface ColorSelectorProps {
  colors: ProductColorVariant[];
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColorId,
  onSelectColor,
}: ColorSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (colors.length === 0) return null;

  const activeVariant =
    colors.find((c) => c.id === (hoveredId ?? selectedColorId)) ?? colors[0];

  return (
    <div className="colorSelector">
      <p className="colorSelectorLabel">
        Color: <strong>{activeVariant.label}</strong>
      </p>

      <div className="colorSelectorGrid" role="radiogroup" aria-label="Seleccionar color">
        {colors.map((variant) => {
          const isSelected = variant.id === selectedColorId;
          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={variant.label}
              className={`colorOption ${isSelected ? "isSelected" : ""}`}
              onClick={() => onSelectColor(variant.id)}
              onMouseEnter={() => setHoveredId(variant.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="colorOptionThumb">
                <img src={variant.previewImage} alt={variant.label} loading="lazy" />
              </span>
              <span className="colorOptionFooter">
                <span
                  className="colorOptionDot"
                  style={{ backgroundColor: variant.hex }}
                  aria-hidden="true"
                />
                <span className="colorOptionName">{variant.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
