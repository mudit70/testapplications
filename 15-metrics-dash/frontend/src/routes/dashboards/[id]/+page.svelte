<script lang="ts">
  import type { Dashboard } from '$lib/api';

  export let data: { dashboard: Dashboard };
</script>

<h1>{data.dashboard.name}</h1>
<p>Owner: {data.dashboard.owner}</p>
