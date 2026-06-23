// Realistic CRUD component using the module API layer (extra coverage).
import React, { useEffect, useState } from 'react';
import { listVehicles, createVehicle, Vehicle } from '../api/api';

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    listVehicles().then(setVehicles);
  }, []);

  const handleAdd = async () => {
    const v = await createVehicle({ plate: 'NEW-001', model: 'Van', status: 'idle' });
    setVehicles((prev) => [...prev, v]);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Vehicle</button>
      {vehicles.map((v) => (
        <div key={v.id}>
          {v.plate} — {v.model}
          <button onClick={() => handleDelete(v.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
