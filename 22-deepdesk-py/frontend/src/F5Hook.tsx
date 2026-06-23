// F5 fe-hook — handler -> function returned by custom hook -> fetch('/api/f5').
import { useState } from "react";
import { useCreateF5 } from "./useF5";

export function F5Hook() {
  const [data, setData] = useState<unknown>(null);
  const createF5 = useCreateF5();

  const handleCreate = async () => {
    const result = await createF5({ author: "me", body: "new ticket" });
    setData(result);
  };

  return (
    <div>
      <button onClick={handleCreate}>F5 Create Ticket</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
