// Realistic create-ticket form (fe-modulefn via api.ts).
import { useState } from "react";
import { createTicket } from "./api";

export function CreateTicket() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    await createTicket({ subject, body, priority: "normal" });
    setSubject("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit">Create Ticket</button>
    </form>
  );
}
