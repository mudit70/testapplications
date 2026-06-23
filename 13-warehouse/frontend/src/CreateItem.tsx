import { useState } from "react";
import { createItem } from "./api";

export function CreateItem() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);

  const handleSubmit = () => {
    createItem({ name, sku, stock }).then(() => {
      setName("");
      setSku("");
      setStock(0);
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        placeholder="Stock"
      />
      <button type="submit">Create item</button>
    </form>
  );
}
