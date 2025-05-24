<script lang="ts">
	import { POST } from '../api/spotify2/login/+server';
</script>

<button
	onclick={() => {
		fetch('/api/spotify2/login', { method: 'POST' });
	}}>bei Spotify anmelden</button
>
