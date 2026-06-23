// F5 fe-hook — custom hook returns a function whose body calls fetch() with a
// static literal URL. The component handler invokes the returned function.

export function useCreateF5() {
  async function create(body: { author: string; body: string }) {
    const res = await fetch("/api/f5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  return create;
}
