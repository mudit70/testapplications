import { useState } from "react";
import { register } from "./api";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = () => {
    register({ email, password, display_name: displayName }).then(() => {
      setEmail("");
      setPassword("");
      setDisplayName("");
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Name" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
