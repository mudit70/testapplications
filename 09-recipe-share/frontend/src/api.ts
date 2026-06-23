// HTTP client for the recipe API using plain fetch().

export interface Recipe {
  id: number;
  title: string;
  body: string;
  image_url: string;
  author_id: number;
  views: number;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes");
  const data = await res.json();
  return data.recipes;
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`/api/recipes/${id}`);
  return res.json();
}

export async function fetchPopular(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes/popular");
  const data = await res.json();
  return data.recipes;
}

export async function createRecipe(input: {
  title: string;
  body: string;
  author_id: number;
  image_name: string;
  image_data: string;
}): Promise<Recipe> {
  const res = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function searchRecipes(q: string): Promise<unknown> {
  const res = await fetch(`/api/recipes/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function importRecipe(externalId: number): Promise<unknown> {
  const res = await fetch("/api/recipes/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ external_id: externalId }),
  });
  return res.json();
}
