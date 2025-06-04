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

<div class=" flex h-screen w-full flex-col bg-[#212121]">
	<Header />
	<div class="relative m-2 flex items-center justify-center">
		<h1 class=" text-4xl text-white">Game</h1>

		<button
			class="absolute right-4 rounded-2xl border p-2 text-white hover:text-green-600 focus:ring-8 focus:ring-green-600 focus:outline-none"
			type="button"
			onclick={() => gameStart(userId)}
		>
			Play again
		</button>
	</div>

	<div class="flex flex-1 items-center justify-center">
		<div class="mt-4 flex h-11/12 w-xl items-center justify-center rounded-2xl bg-[#9E9E9E]">
			<dialog
				bind:this={dialog}
				aria-labelledby="dialog1Title"
				aria-describedby="dialog1Desc"
				class="space-y-4 rounded-2xl p-6 text-xl text-white ring-4 ring-green-600 ring-offset-2 ring-offset-[#212121] outline-none
				backdrop:bg-neutral-800
    			backdrop:opacity-60
				open:size-auto
				open:self-center
				open:justify-self-center
				open:bg-[#212121]
				focus:ring-8 focus:ring-green-600 focus:outline-none"
			>
				<form method="dialog">
					<h1 class="p-4 text-center text-3xl text-white" id="dialog1Title">Wähle eine Playlist</h1>
					<p id="dialog1Desc">die Playlist muss mindestends 8 Lieder enthalten</p>

					{#if playlistSData !== null}
						{#each playlistSData.items as item}
							<button
								aria-haspopup="dialog"
								aria-controls="rules-dialog"
								class="m-6 rounded-2xl border p-2 text-white hover:text-green-600 focus:ring-8 focus:ring-green-600"
								onclick={async () => {
									UriMetaDataMappings = await getSongs(item.id);
									initialized = true;

									dialog.close();
								}}
								><span class="block">Name: {item.name}</span>
								<span class="block">Songs: {item.tracks.total}</span></button
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
