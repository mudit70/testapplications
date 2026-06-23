import { request } from '../lib/http';

// F6 fe-wrapper-dynamic: handler calls a generic request(path) wrapper where
// the URL is the PARAMETER (dynamic), invoked here with a static literal
// argument request('/api/f6').
export default function F6WrapperDynamic() {
  async function handleDelete() {
    await request('/api/f6', { method: 'DELETE' });
  }

  return (
    <div>
      <button onClick={handleDelete}>F6 Delete Product (dynamic wrapper)</button>
    </div>
  );
}
