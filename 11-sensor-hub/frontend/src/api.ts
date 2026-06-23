// Plain fetch() wrappers; URL literals mirror the Tornado routes.

export function listDevices() {
  return fetch('/api/devices').then((r) => r.json());
}

export function registerDevice(name: string, location: string) {
  return fetch('/api/devices', {
    method: 'POST',
    body: JSON.stringify({ name, location }),
  }).then((r) => r.json());
}

export function getDevice(id: number) {
  return fetch(`/api/devices/${id}`).then((r) => r.json());
}

export function deleteDevice(id: number) {
  return fetch(`/api/devices/${id}`, { method: 'DELETE' }).then((r) => r.json());
}

export function listReadings(id: number) {
  return fetch(`/api/devices/${id}/readings`).then((r) => r.json());
}

export function postReading(id: number, value: number) {
  return fetch(`/api/devices/${id}/readings`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  }).then((r) => r.json());
}

export function listFirmware() {
  return fetch('/api/firmware').then((r) => r.json());
}

export function uploadFirmware(blob: Blob) {
  return fetch('/api/firmware', { method: 'POST', body: blob }).then((r) => r.json());
}
