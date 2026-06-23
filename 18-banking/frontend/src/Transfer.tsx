import { useEffect, useState } from "react";
import { transferFunds, fetchTransactions, Transaction } from "./api";

export function Transfer() {
  const [fromAccountId, setFromAccountId] = useState(0);
  const [toAccountId, setToAccountId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions().then(setTransactions);
  }, []);

  const handleTransfer = () => {
    transferFunds({ fromAccountId, toAccountId, amount }).then(() => {
      fetchTransactions().then(setTransactions);
    });
  };

  return (
    <div>
      <h2>Transfer funds</h2>
      <input
        type="number"
        value={fromAccountId}
        onChange={(e) => setFromAccountId(Number(e.target.value))}
        placeholder="From account"
      />
      <input
        type="number"
        value={toAccountId}
        onChange={(e) => setToAccountId(Number(e.target.value))}
        placeholder="To account"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <button onClick={handleTransfer}>Send</button>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            #{t.fromAccountId} → #{t.toAccountId}: ${t.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
