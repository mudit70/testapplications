// F1 fe-inline — handler calls fetch('/api/f1') directly.
import { useState } from "react";

export function F1Inline() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const res = await fetch("/api/f1");
    setData(await res.json());
  };

  return (
    <div>
      <button onClick={handleLoad}>F1 Load Tickets</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
