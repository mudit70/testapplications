import { useEffect, useState } from 'react';
import { User, fetchUser } from '../api';

interface Props {
  userId: string;
}

export function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);

  // Load the profile → GET /api/users/:id
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) {
    return <p>Loading profile…</p>;
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
}
