// Realistic Trip CRUD component (extra coverage).
import React, { useEffect, useState } from 'react';
import { listTrips, createTrip, Trip } from '../api/api';

export default function TripManager() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    listTrips().then(setTrips);
  }, []);

  const handleCreate = async () => {
    const t = await createTrip({ origin: 'A', dest: 'B', distance: 12.5 });
    setTrips((prev) => [...prev, t]);
  };

  const handleComplete = async (id: number) => {
    await fetch(`/api/trips/${id}/complete`, { method: 'POST' });
  };

  return (
    <div>
      <button onClick={handleCreate}>New Trip</button>
      {trips.map((t) => (
        <div key={t.id}>
          {t.origin} → {t.dest}
          <button onClick={() => handleComplete(t.id)}>Complete</button>
        </div>
      ))}
    </div>
  );
}
