import { SvelteMap } from 'svelte/reactivity';
import { toSpotify } from './oAuth';

export interface ProfileData {
	market: string;
	id: string;
}

//MetaDaten von Playlisten des Users
export interface PlaylistMetaDataMetaData {
	items: PlaylistItemsMetaData[];
}

interface PlaylistMetaDataMetaDataError {
	error: { status: number };
}

//MetaDaten von einer Playlist des Users
interface PlaylistItemsMetaData {
	id: string;
	name: string;
	tracks: Tracks;
}

//MetaDaten von ausgewählter Playlist
export interface MetaDataChoosenPlaylist {
	id: string;
	tracks: Tracks;
}
//MetaDaten von Songs aus der Playlist
interface Tracks {
	items: TrackObject[];
	total: number;
}
interface TrackObject {
	track: Track;
}
interface Track {
	artists: Artist[];
	name: string;
	uri: string;
}
interface Artist {
	name: string;
}

interface UriMetaData {
	trackName: string;
	artistName: string;
}

export async function getProfile(): Promise<ProfileData> {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const userData = await response.json();
	//console.log('user Daten: ', userData);
	return userData;
}

export async function getPlaylists(userId: string) {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const PlaylistsMetaDataMetaData: PlaylistMetaDataMetaData | PlaylistMetaDataMetaDataError =
		await response.json();
	//console.log('die response', response);
	console.log('Playlist Items Meta Data: ', PlaylistsMetaDataMetaData);

	if (Object.hasOwn(PlaylistsMetaDataMetaData, 'error')) {
		localStorage.removeItem('access_token');
		toSpotify();
	}
	return PlaylistsMetaDataMetaData as PlaylistMetaDataMetaData;
}

export async function getSongs(playlistId: string) {
	let UriMetaDataMappings = new SvelteMap<string, UriMetaData>();
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const MetaDataChoosenPlaylist: MetaDataChoosenPlaylist = await response.json();
	const items = MetaDataChoosenPlaylist.tracks.items;

	items.forEach((item: TrackObject) =>
		item.track.artists.forEach((aName) => {
			UriMetaDataMappings.set(item.track.uri, {
				trackName: item.track.name,
				artistName: aName.name
			});
		})
	);

	let UriMetaDataMappingsShuffle = UriMetaDataMappings.entries()
		.toArray()
		.sort(() => Math.random() - 0.5);
	let UriMetaDataMappingsEight = UriMetaDataMappingsShuffle.slice(0, 8);
	let UriMetaDataMappingsEnd = new SvelteMap(UriMetaDataMappingsEight);
	return UriMetaDataMappingsEnd;
}
