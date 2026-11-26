import type { SortOption } from "../../utils/sortProducts";
import "./SortSelect.css";

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

function SortSelect({ value, onChange }: Props) {
  return (
    <div className="sortSelect">
      <label htmlFor="sort-select" className="sortSelectLabel">
        Ordenar
      </label>
      <select
        id="sort-select"
        className="sortSelectControl"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        <option value="none">Por categoría</option>
        <option value="price-desc">Precio: de más caro a más barato</option>
        <option value="price-asc">Precio: de más barato a más caro</option>
        <option value="name-asc">Nombre: A a Z</option>
        <option value="name-desc">Nombre: Z a A</option>
      </select>
    </div>
  );
}

export default SortSelect;