// A class-based client; the export flow ends when polling sees the job done.
export class OrdersApi {
  async startExport(): Promise<number> {
    const res = await fetch('/api/exports', { method: 'POST' });
    const { jobId } = await res.json();
    return jobId;
  }

  async exportStatus(jobId: number): Promise<{ status: string; url?: string }> {
    const res = await fetch(`/api/exports/${jobId}`);
    return res.json();
  }
}

export const ordersApi = new OrdersApi();
