import { Controller, useForm } from "react-hook-form";
import { me, removeItem } from "../api";
import { useItems } from "../items-context";
import { Select } from "./Select";

export function Shelf() {
  // A function the context gives, destructured from the hook.
  const { refetch } = useItems();
  // The context's value held whole, and a member of it called.
  const shelf = useItems();
  const form = useForm<{ status: string }>({ defaultValues: { status: "open" } });
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <button onClick={() => shelf.add("book")}>Add</button>
      <button onClick={() => removeItem("1")}>Remove</button>
      <button onClick={() => me()}>Profile</button>
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select value={field.value} options={["open", "closed"]} onValueChange={field.onChange} />
        )}
      />
    </div>
  );
}
