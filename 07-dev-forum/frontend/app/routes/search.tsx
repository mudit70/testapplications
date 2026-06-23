import { useThreadStore } from '../store/threads.store.js';

export default function SearchPage() {
  const threads = useThreadStore((s) => s.threads);
  const searchThreads = useThreadStore((s) => s.searchThreads);
  return (
    <div>
      <input
        type="text"
        placeholder="Search threads"
        onChange={(e) => searchThreads(e.target.value)}
      />
      <ul>
        {threads.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
