<script lang="ts">
	const songs = ['1', '2', '3', '4', '5', '6', '7', '8'];
	let cards: Card[] = $state([]);
	let cardA: null | Card = $state(null);
	let cardB: null | Card = $state(null);

	interface Card {
		value: string;
		id: number;
		found: boolean;
	}

	function createCards(songs: string[]) {
		songs.forEach((v) => {
			let card1 = { value: v, id: cards.length, found: false };
			cards.push(card1);
			let card2 = { value: v, id: cards.length, found: false };
			cards.push(card2);
		});
	}
	createCards(songs);

	function Shuffle(array: Card[]) {
		array.sort(() => Math.random() - 0.5);
		console.log('Play');
	}

	function handleGame(card: Card) {
		if (cardA === null) {
			cardA = card;
		} else if (cardB === null && cardA !== card) {
			cardB = card;

			if (cardA.value === cardB.value) {
				setTimeout(() => {
					if (cardA !== null && cardB !== null) {
						cardA.found = true;
						cardB.found = true;
						console.log('found');
						cardA = null;
						cardB = null;
					}
				}, 1000);

				console.log($state.snapshot(cards));
			} else {
				setTimeout(() => {
					cardA = null;
					cardB = null;
				}, 1000);
			}
		}
	}
</script>

<div class="flex h-screen w-full items-center justify-center bg-slate-900">
	<div class="justify-items-center">
		<h1 class="mb-4 text-4xl text-white">Play the Game</h1>

		<button
			onclick={() => {
				Shuffle(cards);
			}}
			class="mb-12 rounded-sm bg-slate-800 p-3 text-white"
			type="button">Play</button
		>

		<div class="grid grid-flow-col grid-rows-4 justify-items-center gap-4 bg-slate-700 p-4">
			{#each cards as card}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) wichtig für ARIA später!!!-->
				<div
					onclick={() => {
						handleGame(card);
					}}
					class=" flex h-32 w-32 items-center justify-center bg-slate-500 text-white"
					class:invisible={card.found}
				>
					{#if cardA === card}
						<p>{card.value}</p>
					{/if}
					{#if cardB === card}
						<p>{card.value}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
