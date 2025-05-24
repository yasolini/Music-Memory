<script lang="ts">
	const music = $state(['1', '2', '3', '4', '5', '6', '7', '8']);

	function Shuffle(array: string[]) {
		array.sort(() => Math.random() - 0.5);

		// wenn kopie von array erstellt werden soll: return [...array].sort(() => Math.random() - 0.5);
	}
</script>

<div class="flex h-screen w-full items-center justify-center bg-slate-900">
	<div class="justify-items-center">
		<h1 class="mb-4 text-4xl text-white">Play the Game</h1>

		<button
			class="mb-12 rounded-sm bg-slate-800 p-3 text-white"
			type="button"
			onclick={() => Shuffle(music)}>Play</button
		>

		<div class="grid grid-flow-col grid-rows-4 justify-items-center gap-4 bg-slate-700 p-4">
			{#each music as m, i}
				<div
					id="{music[i]}.a"
					class="flex h-32 w-32 items-center justify-center bg-slate-500 text-white"
				>
					{m}
				</div>
			{/each}

			{#each music as m, i}
				<div
					id="{music[i]}.b"
					class="flex h-32 w-32 items-center justify-center bg-slate-500 text-white"
				>
					{m}
				</div>
			{/each}
		</div>
	</div>
</div>

<a href="/daranArbeiten/prototype/static/Dirty Text - Implantation.md" target="_blank"
	>Markdown Datei öffnen</a
>
