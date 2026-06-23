import { RecipeList } from "./RecipeList";
import { CreateRecipe } from "./CreateRecipe";
import { SearchRecipes } from "./SearchRecipes";

export function App() {
  return (
    <div>
      <h1>Recipe Share</h1>
      <SearchRecipes />
      <CreateRecipe />
      <RecipeList />
    </div>
  );
}
