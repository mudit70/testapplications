// F7 be-localfn — frontend is fe-modulefn (handler -> imported getF7 -> fetch('/api/f7')).
// The backend rung varies: path fn -> same-file fn -> SQLAlchemy.
import { useState } from "react";
import { getF7 } from "./api";

export function F7BeLocalFn() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    setData(await getF7());
  };

  return (
    <div>
      <button onClick={handleLoad}>F7 High Priority</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
