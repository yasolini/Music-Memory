<script>
	import { putSongs } from './getPlaybackData.svelte';
	import { UriMetaDataMappings } from './getUserInfos';

	let isPlaying = $state(false);
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>

	<script>
		window.onSpotifyWebPlaybackSDKReady = () => {
			let accessToken = localStorage.getItem('access_token');
			console.log(accessToken);

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
			console.log('player is connected');
			window.player = player;
		};

		/*<button
	onclick={async () => {
		await putSongs();
		window.player.togglePlay();

		console.log('start');
	}}>Toggle Play</button
>*/
	</script>
</svelte:head>

{#each UriMetaDataMappings.entries() as [uri, metaData]}
	<button
		onclick={async () => {
			if (!isPlaying) {
				isPlaying = true;
				await putSongs(uri);

				setTimeout(() => {
					window.player.togglePlay(), (isPlaying = false);
				}, 7000);
				console.log('wuhuhuhu');
			}
		}}
		>Play Song
	</button>
	<p>{metaData.artistName}</p>
	<p>{metaData.trackName}</p>
	<button onclick={window.player.pause()}>Pause</button> <br />
{/each}
