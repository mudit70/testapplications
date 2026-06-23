import { useEffect, useState } from "react";
import { fetchAccounts, Account } from "./api";

export function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetchAccounts().then(setAccounts);
  }, []);

  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            {a.ownerName}: ${a.balance.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
