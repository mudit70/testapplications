import { useEffect, useState } from 'react';
import {
  Todo,
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../api';

interface Props {
  userId: string;
}

export function TodoList({ userId }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');

  // Load todos on mount → GET /api/todos
  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  // Add Todo → POST /api/todos
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const created = await createTodo(title, userId);
    setTodos((prev) => [created, ...prev]);
    setTitle('');
  }

  // Toggle completed → PUT /api/todos/:id
  async function handleToggle(todo: Todo) {
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  // Delete → DELETE /api/todos/:id
  async function handleDelete(id: string) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <section>
      <h2>Todos</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            <span>{todo.title}</span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
