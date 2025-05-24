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
	//id: string;
	//name: string;
	//tracks: Tracks;
}

//get UserData
export async function getProfile(): Promise<ProfileData> {
	let accessToken = localStorage.getItem('access_token');
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + accessToken
		}
	});

	const userData = await response.json();
	//console.log("user Daten: ",userData);
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
	console.log('Choosen Playlist Meta Data: ', MetaDataChoosenPlaylist);

	return MetaDataChoosenPlaylist;
}
