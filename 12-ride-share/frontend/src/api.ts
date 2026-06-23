// HTTP client for the ride-share API using plain fetch().
// URL literals mirror the Echo route patterns in backend/server.go.

export interface Ride {
  id: number;
  rider_id: number;
  driver_id: number;
  origin: string;
  dest: string;
  status: string;
}

export interface Driver {
  id: number;
  name: string;
  lat: number;
  lng: number;
  available: boolean;
}

export async function fetchRides(): Promise<Ride[]> {
  const res = await fetch("/api/rides");
  const data = await res.json();
  return data.rides;
}

export async function fetchRide(id: number): Promise<Ride> {
  const res = await fetch(`/api/rides/${id}`);
  return res.json();
}

export async function requestRide(input: {
  rider_id: number;
  origin: string;
  dest: string;
}): Promise<Ride> {
  const res = await fetch("/api/rides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function completeRide(id: number): Promise<void> {
  await fetch(`/api/rides/${id}/complete`, {
    method: "POST",
  });
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch("/api/drivers");
  const data = await res.json();
  return data.drivers;
}
