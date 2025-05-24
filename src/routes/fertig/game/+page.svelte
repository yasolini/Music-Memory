<script lang="ts">
	import { onMount } from 'svelte';
	import {
		getProfile,
		getPlaylists,
		type ProfileData,
		type PlaylistMetaDataMetaData,
		getSongs
	} from './getUserData';
	import { getToken, toSpotify } from './oAuth';
	import Header from '../header.svelte';
	import type { SvelteMap } from 'svelte/reactivity';
	import Playboard from './playboard.svelte';

	interface UriMetaData {
		trackName: string;
		artistName: string;
	}

	let dialog = $state() as HTMLDialogElement;

	let userData: ProfileData | null = $state(null);
	let userId: string;
	let playlistSData: PlaylistMetaDataMetaData | null = $state(null);

	let accessToken: string | null = null;
	let initialized = $state(false);

	let UriMetaDataMappings = $state() as SvelteMap<string, UriMetaData>;

	onMount(async () => {
		const stored = localStorage.getItem('access_token');
		if (stored) {
			accessToken = stored;
			userData = await getProfile();
			userId = userData.id;
			gameStart(userId);
			return;
		}

		const urlParams = new URLSearchParams(window.location.search);
		let code = urlParams.get('code');

		//check, ob seite erstes mal oder zweites Mal besucht wurde
		if (!code) {
			toSpotify();
			return;
		}

		await getToken(code);
		accessToken = localStorage.getItem('access_token');
		userData = await getProfile();
		userId = userData.id;
		gameStart(userId);

		window.history.replaceState({}, '', window.location.pathname);
	});
	async function gameStart(userId: string) {
		initialized = false;
		playlistSData = await getPlaylists(userId);
		dialog.showModal();
	}
</script>

<div class="flex h-screen w-full flex-col border bg-slate-900">
	<Header />
	<h1 class=" border pt-8 text-center text-4xl text-white">Play Game</h1>

	<button
		onclick={() => {
			gameStart(userId);
		}}
		class="mb-12 rounded-sm bg-slate-800 p-3 text-white"
		type="button">Play again</button
	>

	<div class="flex flex-1 items-center justify-center">
		<div class="h-11/12 w-xl flex items-center justify-center rounded-2xl bg-slate-500">
			<dialog
				bind:this={dialog}
				class="open: rounded-2xl bg-slate-800 backdrop:bg-gray-400 backdrop:opacity-60 open:h-96 open:w-96 open:self-center open:justify-self-center"
			>
				<form method="dialog">
					<p>die Playlist muss mindestends 8 Lieder enthalten</p>

					{#if playlistSData !== null}
						{#each playlistSData.items as item}
							<button
								class="m-7 flex place-self-center justify-self-center rounded-2xl bg-slate-700 p-4 text-2xl text-white"
								onclick={async () => {
									UriMetaDataMappings = await getSongs(item.id);
									initialized = true;

									dialog.close();
								}}>Name: {item.name} Songs: {item.tracks.total}</button
							>
						{/each}
					{/if}
				</form>
			</dialog>

			{#if initialized}
				<Playboard {UriMetaDataMappings} />
			{/if}
		</div>
	</div>
</div>

<svelte:head>
	{#if initialized}
		<script src="https://sdk.scdn.co/spotify-player.js"></script>

		<script>
			window.onSpotifyWebPlaybackSDKReady = () => {
				let accessToken = localStorage.getItem('access_token');
				//console.log(accessToken);

				const token = accessToken;
				const player = new Spotify.Player({
					name: 'Web Playback SDK Quick Start Player',
					getOAuthToken: (cb) => {
						cb(token);
					},
					volume: 0.5
				});
				// Ready
				player.addListener('ready', ({ device_id }) => {
					window.localStorage.setItem('device_id', device_id);
					console.log('Ready with Device ID', device_id);
				});

				// Not Ready
				player.addListener('not_ready', ({ device_id }) => {
					console.log('Device ID has gone offline', device_id);
				});
				player.addListener('initialization_error', ({ message }) => {
					console.error(message);
				});

				player.addListener('authentication_error', ({ message }) => {
					console.error(message);
				});

				player.addListener('account_error', ({ message }) => {
					console.error(message);
				});

				player.connect();
				//console.log('player is connected');
				window.player = player;
			};
		</script>
	{/if}
</svelte:head>
