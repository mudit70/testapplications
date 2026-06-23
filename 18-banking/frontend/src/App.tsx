import { AccountList } from "./AccountList";
import { CreateAccount } from "./CreateAccount";
import { Transfer } from "./Transfer";

export function App() {
  return (
    <div>
      <h1>Retail Banking</h1>
      <AccountList />
      <CreateAccount />
      <Transfer />
    </div>
  );
}
