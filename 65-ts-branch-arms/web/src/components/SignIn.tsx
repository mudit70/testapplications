export function SignIn({ email, password }: { email: string; password: string }) {
  return (
    <button
      onClick={() =>
        fetch("/api/signin", { method: "POST", body: JSON.stringify({ email, password }) })
      }
    >
      Sign in
    </button>
  );
}
