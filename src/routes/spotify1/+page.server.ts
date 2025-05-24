import axios from 'axios';

const client_id: string = 'f87bf4bf9a284f6ca5c83e14479287b0';
const client_secret: string = '5b0609355b8c4ea3a97b6a3b7c5575d8';

// Erstelle den Basic Auth Header
const authHeader: string =
	'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const fetchToken = async () => {
	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({
				grant_type: 'client_credentials'
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: authHeader
				}
			}
		);

		console.log('Access Token:', response.data.access_token);
	} catch (error) {
		console.error('Fehler:', error);
	}
};

fetchToken();

export function load() {
	return {
		client_id
	};
}
