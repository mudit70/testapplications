// Realistic Driver list component (extra coverage).
import React, { useEffect, useState } from 'react';
import { listDrivers, Driver } from '../api/api';

export default function DriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    listDrivers().then(setDrivers);
  }, []);

  return (
    <ul>
      {drivers.map((d) => (
        <li key={d.id}>{d.name} ({d.available ? 'available' : 'busy'})</li>
      ))}
    </ul>
  );
}
