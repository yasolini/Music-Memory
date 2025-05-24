import { SvelteMap } from 'svelte/reactivity';

export interface ProfileData {
	market: string;
	id: string;
}

//MetaDaten aller Playlisten des Users
export interface PlaylistMetaDataMetaData {
	items: PlaylistItemsMetaData[];
}
//MetaDaten über eine Playlist des Users
interface PlaylistItemsMetaData {
	id: string;
	name: string;
}
//MetaDaten über ausgewählte Playlist
export interface MetaDataChoosenPlaylist {
	id: string;
	tracks: Tracks;
}
//MetaDaten über Songs aus der Playlist
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

//export let uris: String[] = [];
export let UriMetaDataMappings = new SvelteMap<string, UriMetaData>();

//get UserData
export async function getProfile(): Promise<ProfileData> {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const userData = await response.json();
	console.log('user Daten: ', userData);
	return userData;
}

//get Playlists
export async function getPlaylists(userId: string) {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const PlaylistsMetaDataMetaData: PlaylistMetaDataMetaData = await response.json();
	//console.log('Playlist Meta Data Meta Data: ', PlaylistsMetaDataMetaData);
	console.log('Playlist Items Meta Data: ', PlaylistsMetaDataMetaData.items);
	return PlaylistsMetaDataMetaData;
}
//get Songs
export async function getSongs(playlistId: string) {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const MetaDataChoosenPlaylist: MetaDataChoosenPlaylist = await response.json();
	const items = MetaDataChoosenPlaylist.tracks.items;

	console.log('Choosen Playlist Meta Data: ', MetaDataChoosenPlaylist);
	console.log('Playlist tracks: ', MetaDataChoosenPlaylist.tracks.items);
	items.forEach((item: TrackObject) =>
		item.track.artists.forEach((aName) => {
			UriMetaDataMappings.set(item.track.uri, {
				trackName: item.track.name,
				artistName: aName.name
			});
		})
	);
	console.log('ganze Map', UriMetaDataMappings);
	console.log('nur uris', UriMetaDataMappings.keys());
}
