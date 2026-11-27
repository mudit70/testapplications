# 51-ts-delegated-events

A vanilla TypeScript front end (`web`) with jQuery and its Express API (`api`), for veoagents
#452. The sign-in panel (`web/src/signin.ts`) wires its controls through delegation:

- the code's own `registerForEvent(root, selector, event, fn)` (`web/src/dom.ts`), given a literal
  id (`#sign-in-email-btn`), a constant class (`SAVE = ".save"`, twice for the same target) and
  a value chosen at run time (`this.lastPanel`);
- jQuery's `$(root).on("click", "#forgot", fn)` and `$("#help").click(fn)`;
- the container's own `addEventListener("click", …)`, checking
  `closest('[data-action="remove"]')`.

Each control is a UI element named by its target, such as `Signin:dom:#sign-in-email-btn:click`,
with a count only between listeners for the same target (`.save:click#2`). Its label comes from
the panel's markup: the button's text, or its `aria-label` when it shows only an icon. The
run-time target keeps the receiver's name (`root?:click#1`) and is an `event_target` Unknown.

Answers are in `expected.yaml`, written from the code.
