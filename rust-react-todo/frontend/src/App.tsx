import { TodoList } from './components/TodoList';
import { UserProfile } from './components/UserProfile';

// Hard-coded demo user for the fixture.
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function App() {
  return (
    <main>
      <h1>Rust + React Todo</h1>
      <UserProfile userId={DEMO_USER_ID} />
      <TodoList userId={DEMO_USER_ID} />
    </main>
  );
}
