import { ItemList } from "./ItemList";
import { CreateItem } from "./CreateItem";
import { SearchItems } from "./SearchItems";

export function App() {
  return (
    <main>
      <h1>Warehouse Inventory</h1>
      <CreateItem />
      <SearchItems />
      <ItemList />
    </main>
  );
}
