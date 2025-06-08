<script lang="ts">
	import type { SvelteMap } from 'svelte/reactivity';
	import { putSongs } from './getPlaybackData.svelte';

	interface UriMetaData {
		trackName: string;
		artistName: string;
	}

	interface Card {
		value: string;
		id: number;
		found: boolean;
	}
	const { UriMetaDataMappings }: { UriMetaDataMappings: SvelteMap<string, UriMetaData> } = $props();
	//console.log('UriMetaData in playboad: ', UriMetaDataMappings);
	let cards: Card[] = $state([]);
	let cardA: null | Card = $state(null);
	let cardB: null | Card = $state(null);

	let songIsLoading = $state<number | null>(null);

	let isPlaying = $state(false);
	let win = $derived.by(() => cards.every((card) => card.found));
	let gameAnnouncement = $state();

	function createCards(songs: string[]) {
		songs.forEach((uri) => {
			let card1 = {
				value: uri,
				id: cards.length,
				found: false
			};
			cards.push(card1);
			let card2 = {
				value: uri,
				id: cards.length,
				found: false
			};
			cards.push(card2);
		});
	}
	createCards(UriMetaDataMappings.keys().toArray());

	function Shuffle(array: Card[]) {
		array.sort(() => Math.random() - 0.5);
	}

	function handleGameLogic(card: Card) {
		if (cardA === null) {
			cardA = card;
		} else if (cardB === null && cardA !== card) {
			cardB = card;

			if (cardA.value === cardB.value) {
				setTimeout(() => {
					if (cardA !== null && cardB !== null) {
						announce('Paar gefunden');
						cardA.found = true;
						cardB.found = true;
						cardA = null;
						cardB = null;
					}
				}, 4000);
			} else {
				setTimeout(() => {
					cardA = null;
					cardB = null;
				}, 4000);
			}
		}
	}
	Shuffle(cards);

	function announce(message: string) {
		gameAnnouncement = message;
		setTimeout(() => (gameAnnouncement = ''), 1000);
	}

	$effect(() => {
		win;
		announce('Du hast gewonnen!');
	});
</script>

<div class="justify-items-center">
	<div
		class="grid h-11/12 w-xl grid-flow-col grid-rows-4 items-center justify-center justify-items-center gap-4 rounded-2xl bg-[#9E9E9E] p-4"
	>
		<div aria-live="assertive" class="sr-only">
			{gameAnnouncement}
		</div>

		{#if win}
			<h1 class="absolute self-center text-6xl text-white">gewonnen</h1>
		{/if}

		{#each cards as card}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) wichtig für ARIA später!!!-->
			<button
				aria-label={cardA === null
					? 'Bestätige um erste Karte aufzudecken'
					: card === cardA
						? 'aufgedeckt'
						: 'Bestätige um zweite Karte aufzudecken'}
				onclick={async () => {
					if (!isPlaying && !card.found) {
						isPlaying = true;
						songIsLoading = card.id;

						// Weird little hack because spotify is laggy and weird :(
						(window as any).player.addListener('player_state_changed', () => {
							(window as any).player.removeListener('player_state_changed');
							if (songIsLoading === null) return;
							songIsLoading = null;
							setTimeout(() => {
								(window as any).player.togglePlay();
								isPlaying = false;
							}, 5000);
							handleGameLogic(card);
						});

						await putSongs(card.value);
					}
				}}
				class={{
					'opacity-50': isPlaying,
					invisible: card.found,
					'relative flex size-28 items-center justify-center rounded-2xl bg-[#212121] text-neutral-300   duration-200 hover:scale-105  hover:text-green-600 focus-visible:text-green-600 focus-visible:ring-8 focus-visible:ring-green-600 focus-visible:ring-offset-2': true
				}}
			>
				{#if card === cardA}
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class={{
							'size-14': true,
							'animate-bounce': isPlaying && songIsLoading === null && cardB === null
						}}
					>
						<path
							d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
						/>
						<path
							d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
						/>
					</svg>
				{:else if card === cardB}
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class={{ 'size-14': true, 'animate-bounce': isPlaying && songIsLoading === null }}
					>
						<path
							d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
						/>
						<path
							d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
						/>
					</svg>
				{:else}
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-14"
					>
						<path
							d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
						/>
					</svg>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 256 256"
						class={{
							'absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 animate-spin text-white': true,
							hidden: card.id !== songIsLoading
						}}
						><rect width="256" height="256" fill="none" /><path
							d="M168,40a97,97,0,0,1,56,88,96,96,0,0,1-192,0A97,97,0,0,1,88,40"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="24"
						/></svg
					>
				{/if}
			</button>
		{/each}
	</div>
</div>
