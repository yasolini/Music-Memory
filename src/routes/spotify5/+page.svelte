<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getProfile,
		getPlaylists,
		type ProfileData,
		type PlaylistMetaDataMetaData,
		getSongs
	} from './getUserInfos';
	import { getToken, toSpotify } from './oAuth';
	import Playback from './playback.svelte';

	let userData: ProfileData | null = $state(null);
	let userId: string;

	let playlistSData: PlaylistMetaDataMetaData | null = $state(null);
	let initialized = $state(false);

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		let code = urlParams.get('code');

		//check, ob seite erstes mal oder zweites Mal besucht wurde
		if (code !== null) {
			console.log('code check', code);
			await getToken(code);
			console.log('code check', code);
			userData = await getProfile();
			userId = userData.id;
			initialized = true;
		}
	});
</script>

<h1>spotify 5</h1>

<button onclick={toSpotify}>Login</button>

<button
	onclick={async () => {
		playlistSData = await getPlaylists(userId);
	}}
>
	get Playlists
</button>

{#if playlistSData !== null}
	{#each playlistSData.items as item}
		<button
			onclick={() => {
				getSongs(item.id);
			}}>{item.name}</button
		>
	{/each}
{/if}
<p>-----------------</p>

{#if initialized}
	<Playback />
{/if}
