// F6 fe-wrapper-dynamic — handler -> generic request(path) wrapper (dynamic URL)
// -> fetch(path). The path literal '/api/f6' is supplied at the call site.
import { useState } from "react";
import { request } from "./request";

export function F6WrapperDynamic() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const result = await request("/api/f6");
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>F6 Load High Priority</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
