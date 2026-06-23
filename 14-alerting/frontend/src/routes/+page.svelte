<script lang="ts">
  import { createAlert, ackAlert } from '$lib/api';
  import type { Alert, AlertStats } from '$lib/api';

  export let data: { alerts: Alert[]; stats: AlertStats };

  let title = '';
  let severity = 'critical';

  async function submit() {
    const created = await createAlert(fetch, title, severity);
    data.alerts = [...data.alerts, created];
    title = '';
  }

  async function ack(id: string) {
    await ackAlert(fetch, id);
    data.alerts = data.alerts.map((a) =>
      a.id === id ? { ...a, status: 'acked' } : a,
    );
  }
</script>

<h1>Incident Alerts</h1>

<p>Open: {data.stats.open} · Acked: {data.stats.acked}</p>

<form on:submit|preventDefault={submit}>
  <input bind:value={title} placeholder="Alert title" />
  <select bind:value={severity}>
    <option value="critical">critical</option>
    <option value="warning">warning</option>
  </select>
  <button type="submit">Create</button>
</form>

<ul>
  {#each data.alerts as alert (alert.id)}
    <li>
      <strong>{alert.title}</strong> [{alert.severity}] — {alert.status}
      {#if alert.status !== 'acked'}
        <button on:click={() => ack(alert.id)}>Ack</button>
      {/if}
    </li>
  {/each}
</ul>
