// F9 be-classmethod — frontend is fe-modulefn (handler -> imported getF9 -> fetch('/api/f9')).
// The backend rung varies: path fn -> service class instance method -> SQLAlchemy.
import { useState } from "react";
import { getF9 } from "./api";

export function F9BeClassMethod() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    setData(await getF9());
  };

  return (
    <div>
      <button onClick={handleLoad}>F9 Agents</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
