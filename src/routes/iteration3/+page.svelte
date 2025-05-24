<script lang="ts">
	const songs = ['1', '2', '3', '4', '5', '6', '7', '8'];
	let cards: Card[] = $state([]);
	let shownId = $state();

	interface Card {
		value: string;
		id: string;
	}

	function createCards(songs: string[]) {
		songs.forEach((v, i) => {
			let card = { value: v, id: i + '.a' };
			cards.push(card);
		});
		songs.forEach((v, i) => {
			let card = { value: v, id: i + '.b' };
			cards.push(card);
		});
	}

	createCards(songs);

	function Shuffle(array: Card[]) {
		array.sort(() => Math.random() - 0.5);
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
					onclick={() => (shownId = card.id)}
					class=" flex h-32 w-32 items-center justify-center bg-slate-500 text-white"
				>
					{#if shownId === card.id}
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
