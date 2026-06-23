import { F1Inline } from "./F1Inline";
import { F2LocalFn } from "./F2LocalFn";
import { F3ModuleFn } from "./F3ModuleFn";
import { F4ClassMethod } from "./F4ClassMethod";
import { F5Hook } from "./F5Hook";
import { F6WrapperDynamic } from "./F6WrapperDynamic";
import { F7BeLocalFn } from "./F7BeLocalFn";
import { F8BeModuleFn } from "./F8BeModuleFn";
import { F9BeClassMethod } from "./F9BeClassMethod";
import { TicketList } from "./TicketList";
import { CreateTicket } from "./CreateTicket";
import { AgentPanel } from "./AgentPanel";

export default function App() {
  return (
    <div>
      <h1>DeepDesk — dispatch-rung matrix</h1>
      <F1Inline />
      <F2LocalFn />
      <F3ModuleFn />
      <F4ClassMethod />
      <F5Hook />
      <F6WrapperDynamic />
      <F7BeLocalFn />
      <F8BeModuleFn />
      <F9BeClassMethod />
      <hr />
      <CreateTicket />
      <TicketList />
      <AgentPanel />
    </div>
  );
}
