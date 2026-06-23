import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { ProfilePanel } from "./ProfilePanel";

export function App() {
  return (
    <main>
      <h1>Auth Service</h1>
      <RegisterForm />
      <LoginForm />
      <ProfilePanel userId={1} />
    </main>
  );
}
