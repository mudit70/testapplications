// HTTP client for the banking API using plain fetch().

export interface Account {
  id: number;
  ownerName: string;
  balance: number;
}

export interface Transaction {
  id: number;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

export async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch("/api/accounts");
  return res.json();
}

export async function fetchAccount(id: number): Promise<Account> {
  const res = await fetch(`/api/accounts/${id}`);
  return res.json();
}

export async function createAccount(input: {
  ownerName: string;
  balance: number;
}): Promise<Account> {
  const res = await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function transferFunds(input: {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}): Promise<Transaction> {
  const res = await fetch("/api/transactions/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/transactions");
  return res.json();
}
