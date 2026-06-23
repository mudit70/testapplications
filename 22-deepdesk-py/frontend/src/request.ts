// F6 fe-wrapper-dynamic — generic request wrapper whose fetch() URL is the
// function parameter (dynamic). The component handler passes the path literal
// at the call site. This exercises the wrapper/call-site resolution path.

export async function request(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(path, init);
  return res.json();
}
