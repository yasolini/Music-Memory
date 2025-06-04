export async function putSongs(uri: string) {
	let deviceId = localStorage.getItem('device_id');
	let accessToken = localStorage.getItem('access_token');
	try {
		const response = await fetch(
			'https://api.spotify.com/v1/me/player/play?device_id=' + deviceId,
			{
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + accessToken,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					uris: [uri],
					position_ms: 60000
				})
			}
		);
	} catch (e) {
		console.log('putsongs error', e);
	}
}
