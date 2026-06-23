<script lang="ts">
  import { createDashboard, recordMetric, exportSnapshot } from '$lib/api';
  import type { Dashboard } from '$lib/api';

  export let data: { dashboards: Dashboard[] };

  let name = '';
  let owner = '';

  async function submit() {
    const created = await createDashboard(fetch, name, owner);
    data.dashboards = [...data.dashboards, created];
    name = '';
    owner = '';
  }

  async function record(id: number) {
    await recordMetric(fetch, id, { name: 'requests', value: 1 });
  }

  async function exportTo(id: number) {
    await exportSnapshot(fetch, id);
  }
</script>

<h1>Metrics Dashboards</h1>

<form on:submit|preventDefault={submit}>
  <input bind:value={name} placeholder="Dashboard name" />
  <input bind:value={owner} placeholder="Owner" />
  <button type="submit">Create</button>
</form>

<ul>
  {#each data.dashboards as dash (dash.id)}
    <li>
      <strong>{dash.name}</strong> — {dash.owner}
      <button on:click={() => record(dash.id)}>Record metric</button>
      <button on:click={() => exportTo(dash.id)}>Export</button>
    </li>
  {/each}
</ul>
