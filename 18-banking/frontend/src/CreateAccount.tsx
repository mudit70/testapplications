import { useState } from "react";
import { createAccount, Account } from "./api";

export function CreateAccount() {
  const [ownerName, setOwnerName] = useState("");
  const [balance, setBalance] = useState(0);
  const [created, setCreated] = useState<Account | null>(null);

  const handleSubmit = () => {
    createAccount({ ownerName, balance }).then(setCreated);
  };

  return (
    <div>
      <h2>Open account</h2>
      <input
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        placeholder="Owner name"
      />
      <input
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
        placeholder="Opening balance"
      />
      <button onClick={handleSubmit}>Create</button>
      {created && <p>Created account #{created.id}</p>}
    </div>
  );
}
