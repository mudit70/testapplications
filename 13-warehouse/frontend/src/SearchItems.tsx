import { useState } from "react";
import { searchItems } from "./api";

export function SearchItems() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<unknown>(null);

  const handleSearch = () => {
    searchItems(q).then(setResults);
  };

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items" />
      <button onClick={handleSearch}>Search</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
