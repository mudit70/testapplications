import { useState } from "react";
import { searchRecipes, importRecipe } from "./api";

export function SearchRecipes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<unknown>(null);

  const handleSearch = async () => {
    const data = await searchRecipes(query);
    setResults(data);
  };

  const handleImport = async () => {
    await importRecipe(42);
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleImport}>Import #42</button>
      <pre>{JSON.stringify(results)}</pre>
    </div>
  );
}
