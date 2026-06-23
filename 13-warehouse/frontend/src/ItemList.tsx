import { useEffect, useState } from "react";
import { fetchItems, adjustStock, Item } from "./api";

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const handleRestock = (id: number) => {
    adjustStock(id, 100).then(() => fetchItems().then(setItems));
  };

  return (
    <div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            {it.name} ({it.sku}) — {it.stock}
            <button onClick={() => handleRestock(it.id)}>Restock</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
