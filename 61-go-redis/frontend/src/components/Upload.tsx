import React from 'react';

export default function Upload() {
  const start = async () => {
    await fetch('/api/uploads/report.pdf', {
      method: 'POST',
      headers: { 'Upload-Length': '1024' },
    });
  };
  const resume = async () => {
    await fetch('/api/uploads/report.pdf');
  };
  const cancel = async () => {
    await fetch('/api/uploads/report.pdf', { method: 'DELETE' });
  };

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={resume}>Resume</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}
