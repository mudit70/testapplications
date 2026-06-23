// Shared API module — used by F3 (module function) and the CRUD components.
// Each function holds a STATIC URL literal that matches a Gin route.

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  status: string;
}

export interface Driver {
  id: number;
  name: string;
  license: string;
  available: boolean;
}

export interface Trip {
  id: number;
  origin: string;
  dest: string;
  distance: number;
  status: string;
}

// F3 fe-modulefn target: handler → this imported fn → fetch('/api/f3')
export async function fetchF3Drivers(): Promise<Driver[]> {
  const res = await fetch('/api/f3');
  return res.json();
}

// Reused by F7/F8/F9 components (frontend held = modulefn).
export async function fetchF7(): Promise<Vehicle[]> {
  const res = await fetch('/api/f7');
  return res.json();
}

export async function fetchF8(): Promise<Trip[]> {
  const res = await fetch('/api/f8');
  return res.json();
}

export async function fetchF9(): Promise<Driver[]> {
  const res = await fetch('/api/f9');
  return res.json();
}

// CRUD helpers (static literals) used by extra components.
export async function listVehicles(): Promise<Vehicle[]> {
  const res = await fetch('/api/vehicles');
  return res.json();
}

export async function createVehicle(v: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch('/api/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(v),
  });
  return res.json();
}

export async function listTrips(): Promise<Trip[]> {
  const res = await fetch('/api/trips');
  return res.json();
}

export async function createTrip(t: Partial<Trip>): Promise<Trip> {
  const res = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(t),
  });
  return res.json();
}

export async function listDrivers(): Promise<Driver[]> {
  const res = await fetch('/api/drivers');
  return res.json();
}
