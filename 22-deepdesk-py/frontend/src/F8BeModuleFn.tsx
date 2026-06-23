// F8 be-modulefn — frontend is fe-modulefn (handler -> imported getF8 -> fetch('/api/f8')).
// The backend rung varies: path fn -> imported repository fn -> SQLAlchemy.
import { useState } from "react";
import { getF8 } from "./api";

export function F8BeModuleFn() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    setData(await getF8());
  };

  return (
    <div>
      <button onClick={handleLoad}>F8 Ticket Comments</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
