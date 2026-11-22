// Tiny API client. URLs and HTTP methods are kept statically obvious
// so a static analyzer can trace each call to its backend route.

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos');
  return res.json();
}

export async function createTodo(title: string, userId: string): Promise<Todo> {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, user_id: userId }),
  });
  return res.json();
}

export async function updateTodo(
  id: string,
  patch: { title?: string; completed?: boolean }
): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}
