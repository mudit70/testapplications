"use client";

const post = (path: string, body: unknown) =>
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export function Billing({ customer }: { customer: string }) {
  const subscribe = async () => {
    await post("/api/subscribe", { customer, price: "price_pro" });
  };
  const changePlan = async () => {
    await post("/api/plan", { id: "sub_1", price: "price_team" });
  };
  const sendInvoice = async () => {
    await post("/api/invoice", { customer });
  };
  const signUp = async () => {
    await post("/api/signup", { email: "new@example.com" });
  };
  return (
    <div>
      <button onClick={subscribe}>Subscribe</button>
      <button onClick={changePlan}>Change plan</button>
      <button onClick={sendInvoice}>Send invoice</button>
      <button onClick={signUp}>Sign up</button>
    </div>
  );
}
