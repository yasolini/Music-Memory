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

	let userData: ProfileData | null = $state(null);
	let userId: string;

	let playlistSData: PlaylistMetaDataMetaData | null = $state(null);

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		let code = urlParams.get('code');

		//check, ob seite erstes mal oder zweites Mal besucht wurde
		if (code !== null) {
			console.log('code check');
			getToken(code);

			userData = await getProfile();
			userId = userData.id;
		}
	});
</script>

<h1>spotify4</h1>

<button onclick={toSpotify}>Login</button>

<button
	onclick={async () => {
		playlistSData = await getPlaylists(userId);
	}}>get Playlists</button
>
{#if playlistSData !== null}
	{#each playlistSData.items as item}
		<button
			onclick={() => {
				getSongs(item.id);
			}}>{item.name}</button
		>
	{/each}
{/if}
