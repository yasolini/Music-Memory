import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

var client_id = 'f87bf4bf9a284f6ca5c83e14479287b0';
var redirect_uri = 'http://localhost:5173/callback';

export const POST: RequestHandler = async ({ request }) => {
	var state = generateRandomString(16);
	var scope = 'user-read-private user-read-email';

	redirect(
		301,
		'https://accounts.spotify.com/authorize?' +
			`response_type=code` +
			`&client_id=${client_id}` +
			`&scope=${scope}` +
			`&redirect_uri=${encodeURIComponent(redirect_uri)}` +
			`&state=${state}`
	);
};

const generateRandomString = (length: number): string => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};
