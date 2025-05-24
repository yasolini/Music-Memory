//mit PKCE
let codeChallenge = '';

const clientId = 'f87bf4bf9a284f6ca5c83e14479287b0';
const redirectUri = 'http://localhost:5173/fertig/game';

const scope =
	'user-read-email user-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming';
const authUrl = new URL('https://accounts.spotify.com/authorize');

const generateRandomString = (length: number) => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const codeVerifier = generateRandomString(64);

const sha256 = async (plain: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest('SHA-256', data); //gibt einen arrayBuffer zurück (Array mit Bytes drinn)
};

const base64encode = (input: ArrayBuffer) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
};

export async function toSpotify() {
	const hashed = await sha256(codeVerifier);
	codeChallenge = base64encode(hashed);
	//console.log('codeChallenge check');

	// generated in the previous step
	window.localStorage.setItem('code_verifier', codeVerifier);

	const params = {
		response_type: 'code',
		client_id: clientId,
		scope,
		code_challenge_method: 'S256',
		code_challenge: codeChallenge,
		redirect_uri: redirectUri
	};

	authUrl.search = new URLSearchParams(params).toString();
	window.location.href = authUrl.toString(); //redirect to spotify authorisation with params
}

export const getToken = async (code: string) => {
	// stored in the previous step
	const codeVerifier = localStorage.getItem('code_verifier') as string;
	//console.log('codeVerifier check');

	const url = 'https://accounts.spotify.com/api/token';
	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
			code_verifier: codeVerifier
		})
	};
	const response = await fetch(url, payload);
	const body = await response.json();
	//console.log('response check', body);
	localStorage.setItem('access_token', body.access_token);
};
