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

	let isPlaying = $state(false);
	let win = $derived.by(() => cards.every((card) => card.found));

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
						cardA.found = true;
						cardB.found = true;
						cardA = null;
						cardB = null;
					}
				}, 2000);
			} else {
				setTimeout(() => {
					cardA = null;
					cardB = null;
				}, 1000);
			}
		}
	}

	Shuffle(cards);
</script>

<div class="justify-items-center">
	<div
		class="grid grid-flow-col grid-rows-4 justify-items-center gap-4 rounded-2xl bg-slate-700 p-4"
	>
		{#if win}
			<p>gewonnen</p>
		{/if}
		{#each cards as card}
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) wichtig für ARIA später!!!-->
			<div
				onclick={async () => {
					if (!isPlaying) {
						isPlaying = true;
						await putSongs(card.value);

						setTimeout(() => {
							window.player.togglePlay();
							isPlaying = false;
						}, 5000);
						handleGameLogic(card);
					}
				}}
				class={{
					invisible: card.found,
					'flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-500 text-white': true
				}}
			>
				{#if cardA === card}
					<p>{UriMetaDataMappings.get(card.value)?.artistName}</p>
					<p>{UriMetaDataMappings.get(card.value)?.trackName}</p>
				{/if}
				{#if cardB === card}
					<p>{UriMetaDataMappings.get(card.value)?.artistName}</p>
					<p>{UriMetaDataMappings.get(card.value)?.trackName}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
