// F2 fe-localfn — handler -> same-file function -> fetch('/api/f2').
import { useState } from "react";

async function loadOpen(): Promise<unknown> {
  const res = await fetch("/api/f2");
  return res.json();
}

export function F2LocalFn() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const result = await loadOpen();
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>F2 Load Open</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
