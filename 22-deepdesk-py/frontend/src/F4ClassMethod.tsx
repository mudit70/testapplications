// F4 fe-classmethod — handler -> method on imported class instance -> fetch('/api/f4').
import { useState } from "react";
import { apiClient } from "./apiClient";

export function F4ClassMethod() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const result = await apiClient.getF4();
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>F4 Load Comments</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
