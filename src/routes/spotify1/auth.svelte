<script lang="ts">
	import { onMount } from 'svelte';
	export let data;

	// Spotify API Credentials
	const clientId: string = data.client_id;
	const redirectUri: string = 'http://localhost:5173/';
	const scope: string = 'user-read-private';

	// Code-Verifizierer
	const generateRandomString = (length: number): string => {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], '');
	};

	// Code-Herausforderung
	const sha256 = async (plain: string): Promise<ArrayBuffer> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(plain);
		return window.crypto.subtle.digest('SHA-256', data);
	};

	const base64encode = (input: ArrayBuffer): string => {
		return btoa(String.fromCharCode(...new Uint8Array(input)))
			.replace(/=/g, '')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
	};

	const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
		const hashed = await sha256(codeVerifier);
		return base64encode(hashed);
	};

	// Funktion zum Anfordern des Zugriffstokens
	const getToken = async (code: string) => {
		console.log('anfang');
		const codeVerifier = localStorage.getItem('code_verifier');

		if (!codeVerifier) {
			console.error('Code verifier not found');
			return;
		}

		const url = 'https://accounts.spotify.com/api/token';
		const payload = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + btoa(`${clientId}`)
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				code_verifier: codeVerifier
			})
		};

		try {
			const response = await fetch(url, payload);
			const data = await response.json();

			if (response.ok) {
				console.log('ok');
				//localStorage.setItem('access_token', data.access_token);
				/*const prom = await fetch('https://api.spotify.com/v1/me', {
					headers: { Authorization: `Bearer ${data.access_token}` }
				});
				const userData = await prom.json();

				console.log('Nutzer-ID: ', userData.id);
				console.log('Typ: ', userData.product);
				console.log('Access token:', data.access_token);*/
			} else {
				console.error('Error fetching token:', data);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	// Lifecycle-Funktion
	onMount(async () => {
		// Generiere den Code Verifier und Challenge
		const codeVerifier = generateRandomString(64);
		console.log('Code Verifier:', codeVerifier);

		const codeChallenge = await generateCodeChallenge(codeVerifier);
		console.log('Code Challenge:', codeChallenge);

		// Speichere den Code Verifier im Local Storage
		window.localStorage.setItem('code_verifier', codeVerifier);

		// Überprüfe, ob wir von Spotify zurückgeleitet wurden
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			// Wenn ein Code vorhanden ist, fordere das Zugriffstoken an
			await getToken(code);
		} else {
			// Wenn kein Code vorhanden ist, starte den Autorisierungsprozess
			const authUrl = new URL('https://accounts.spotify.com/authorize');
			const params = {
				response_type: 'code',
				client_id: clientId,
				scope,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge,
				redirect_uri: redirectUri
			};

			authUrl.search = new URLSearchParams(params).toString();
			console.log('Auth URL:', authUrl.toString());

			// Leite den Benutzer zur Spotify-Autorisierungsseite weiter
			window.location.href = authUrl.toString();
			/*
			// Öffne die Spotify-Authentifizierungsseite in einem neuen Tab
			const newTab = window.open(authUrl, '_blank');

			// Überprüfe, ob der Tab blockiert wurde
			if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
				alert('Neuer Tab wurde blockiert. Bitte erlaube Popups für diese Seite.');
			}*/
		}
	});
</script>
