<script lang="ts">
	const songs = ['1', '2', '3', '4', '5', '6', '7', '8'];
	let cards: Card[] = [];
	let shuffletCards: Card[] = $state([]);
	let shownIdA: null | number = $state(null);
	let shownIdB: null | number = $state(null);

	interface Card {
		value: string;
		id: number;
	}

	function createCards(songs: string[]) {
		songs.forEach((v) => {
			let card1 = { value: v, id: cards.length };
			cards.push(card1);
			let card2 = { value: v, id: cards.length };
			cards.push(card2);
		});
	}
	createCards(songs);
	console.log(cards);

	function Shuffle(array: Card[]) {
		shuffletCards = [...array].sort(() => Math.random() - 0.5);
		console.log('Play');
		console.log(shuffletCards);
	}

	function handleGame(card: Card) {
		if (shownIdA === null) {
			shownIdA = card.id;
			console.log('A: ' + shownIdA);
		} else if (shownIdB === null) {
			shownIdB = card.id;
			console.log('B: ' + shownIdB);

			console.log('vorher valueA: ' + cards[shownIdA].value);
			console.log('vorher valueB: ' + cards[shownIdB].value);

			if (cards[shownIdA].value === cards[shownIdB].value) {
				console.log('nachher valueA: ' + cards[shownIdA].value);
				console.log('nachher valueB: ' + cards[shownIdB].value);
				console.log('yes');
			} else {
				setTimeout(() => {
					shownIdA = null;
					shownIdB = null;
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
			{#each shuffletCards as card}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) wichtig für ARIA später!!!-->
				<div
					onclick={() => {
						handleGame(card);
					}}
					class=" flex h-32 w-32 items-center justify-center bg-slate-500 text-white"
				>
					{#if shownIdA === card.id}
						<p>{card.value}</p>
					{/if}
					{#if shownIdB === card.id}
						<p>{card.value}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<a href="/daranArbeiten/prototype/static/Dirty Text - Implantation.md" target="_blank"
	>Markdown Datei öffnen</a
>
