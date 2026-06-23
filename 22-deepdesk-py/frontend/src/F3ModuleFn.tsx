// F3 fe-modulefn — handler -> imported fn from api.ts -> fetch('/api/f3').
import { useState } from "react";
import { getF3 } from "./api";

export function F3ModuleFn() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const result = await getF3();
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>F3 Load Agents</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
