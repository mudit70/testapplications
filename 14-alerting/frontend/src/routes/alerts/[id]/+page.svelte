<script lang="ts">
  import { attachEvidence } from '$lib/api';
  import type { Alert } from '$lib/api';

  export let data: { alert: Alert };

  let file: FileList | null = null;

  async function upload() {
    if (!file || !file[0]) return;
    await attachEvidence(fetch, data.alert.id, file[0]);
  }
</script>

<h1>{data.alert.title}</h1>
<p>Severity: {data.alert.severity} — Status: {data.alert.status}</p>

<form on:submit|preventDefault={upload}>
  <input type="file" bind:files={file} />
  <button type="submit">Attach evidence</button>
</form>
