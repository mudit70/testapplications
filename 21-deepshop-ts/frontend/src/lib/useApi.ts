// F5 fe-hook rung: a custom hook returns a function that calls fetch with a
// STATIC URL literal. The component calls the returned function in its handler.
export function useApi() {
  async function run() {
    const res = await fetch('/api/f5');
    if (!res.ok) throw new Error('Failed to load F5');
    return res.json();
  }
  return { run };
}
