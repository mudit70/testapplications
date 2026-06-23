import { useState } from "react";
import { login, logout, Session } from "./api";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  const handleLogin = () => {
    login({ email, password }).then(setSession);
  };

  const handleLogout = () => {
    if (session) {
      logout(session.token).then(() => setSession(null));
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
      {session && <button onClick={handleLogout}>Log out</button>}
    </div>
  );
}
