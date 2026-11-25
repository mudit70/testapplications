"use client";

export function Signup({ email }: { email: string }) {
  return (
    <button
      onClick={() =>
        fetch("/api/signup", { method: "POST", body: JSON.stringify({ email }) })
      }
    >
      Sign up
    </button>
  );
}
