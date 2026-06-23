import { useEffect, useState } from "react";
import { fetchRecipes, fetchPopular, Recipe } from "./api";

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const handleShowPopular = () => {
    fetchPopular().then(setRecipes);
  };

  return (
    <div>
      <button onClick={handleShowPopular}>Show popular</button>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}
