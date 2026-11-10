import { useState } from 'react';
import { ordersApi } from '../lib/ordersApi';

// Export orders: accepted with 202, finished when a later poll says so.
export default function ExportPage() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'failed'>('idle');
  const [url, setUrl] = useState('');

  async function startExport() {
    setState('running');
    const jobId = await ordersApi.startExport();
    for (;;) {
      await new Promise((r) => setTimeout(r, 1000));
      const job = await ordersApi.exportStatus(jobId);
      if (job.status === 'done') {
        setUrl(job.url ?? '');
        setState('done');
        return;
      }
      if (job.status === 'failed') {
        setState('failed');
        return;
      }
    }
  }

  return (
    <div>
      <button onClick={startExport}>Export orders</button>
      {state === 'running' && <span className="spinner" />}
      {state === 'done' && <a href={url}>Download export</a>}
      {state === 'failed' && <p className="error">The export failed.</p>}
    </div>
  );
}
