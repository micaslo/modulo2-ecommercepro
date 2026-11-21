import { useState } from "react";
import type {
  ProductDetails,
  ProductKeySpec,
  ProductSpecGroup,
} from "../../../types/productMedia";
import { SpecIcon } from "../productIcons/ProductIcons";
import "./ProductSpecs.css";

interface ProductSpecsProps {
  productKind: ProductDetails["productKind"];
  keySpecs: ProductKeySpec[];
  specGroups: ProductSpecGroup[];
}

export default function ProductSpecs({
  productKind,
  keySpecs,
  specGroups,
}: ProductSpecsProps) {
  const [expanded, setExpanded] = useState(false);

  const sectionTitle =
    productKind === "car"
      ? "Características del vehículo"
      : productKind === "camera"
        ? "Características de la cámara"
        : productKind === "gaming"
          ? "Características del joystick"
          : "Características del producto";

  const sectionBadge =
    productKind === "car" || productKind === "camera"
      ? "Ficha técnica"
      : "Especificaciones";

  return (
    <section className="productPageSection pageCard productSpecs" id="caracteristicas">
      <div className="sectionHeader">
        <h2>{sectionTitle}</h2>
        <span className="sectionBadge">{sectionBadge}</span>
      </div>

      <div className="keySpecsGrid">
        {keySpecs.map((spec) => (
          <div className="keySpecCard" key={`${spec.icon}-${spec.label}`}>
            <span className="keySpecIcon">
              <SpecIcon name={spec.icon} size={22} />
            </span>
            <div className="keySpecText">
              <span className="keySpecLabel">{spec.label}</span>
              <strong className="keySpecValue">{spec.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {specGroups.length > 0 && (
        <div className="specTablesWrapper">
          {expanded && (
            <div className="specGroupsGrid">
              {specGroups.map((group) => (
                <div className="specGroup" key={group.title}>
                  <h3 className="specGroupTitle">{group.title}</h3>
                  <table className="specTable">
                    <tbody>
                      {group.rows.map((row) => (
                        <tr key={row.label}>
                          <th>{row.label}</th>
                          <td>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="specToggleBtn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded
              ? "Ver menos características ▲"
              : "Ver todas las características ▼"}
          </button>
        </div>
      )}
    </section>
  );
}
