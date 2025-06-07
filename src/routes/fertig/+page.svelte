<script lang="ts">
	import Header from './header.svelte';

	let dialog: HTMLDialogElement;

	let focusStyle = 'focus:ring-6 focus:ring-green-600 focus:outline-none ne-roundedfocus:outli';
</script>

<Header />
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="flex h-screen w-full flex-col bg-[#212121]">
	<h1
		aria-label="Willkommen bei Music Memory"
		tabindex="0"
		class={focusStyle + ' p-5 text-center text-4xl text-white'}
	>
		Willkommen bei Music Memory
	</h1>
	<h2 tabindex="0" class={focusStyle + ' p-5 text-center text-3xl text-white'}>
		Spiele Memory mit Songs aus deiner Spotify-Playlist!
	</h2>

	<div class="flex flex-col items-center justify-center p-4">
		<ul
			aria-label="Informationen zum Spiel"
			role="list"
			class="mb-10 size-auto list-inside list-disc space-y-4 text-2xl text-white"
		>
			<li tabindex="0" role="listitem" class={focusStyle}>
				Verbinde dich mit deinem Spotify Premium Account
			</li>
			<li tabindex="0" role="listitem" class={focusStyle}>Beste Unterhaltung mit deiner Musik!</li>
			<li tabindex="0" role="listitem" class={focusStyle}>
				Spiele Memory mit deiner eigenen Playlist
			</li>
			<li tabindex="0" role="listitem" class={focusStyle}>Solo-Spiel – ideal für zwischendurch</li>

			<button
				class={focusStyle + ' m-6 rounded-2xl border p-2 text-white hover:text-green-600'}
				onclick={() => {
					dialog.showModal();
					dialog.focus();
				}}>Zu den Spielregeln</button
			>
			<a
				role="button"
				aria-label="Staren mit Spotify Premium"
				class={focusStyle + ' m-6 rounded-2xl border p-2 text-white hover:text-green-600'}
				href="/fertig/game">Play mit Spotify Premium</a
			>
		</ul>
	</div>
</div>

<div>
	<dialog
		bind:this={dialog}
		aria-labelledby="dialog1Title"
		aria-describedby="dialog1Desc"
		class="
		space-y-4 rounded-2xl
		p-6

    text-xl
    text-white
    ring-4
    ring-green-600
    ring-offset-2
    ring-offset-[#212121]
    outline-none
    
	backdrop:bg-neutral-800
    backdrop:opacity-60
	open:size-auto
	open:self-center
	open:justify-self-center
    open:bg-[#212121]
	focus:ring-8 focus:ring-green-600 focus:outline-none"
	>
		<h2 class="p-4 text-center text-3xl text-white" id="dialog1Title">Spielregeln</h2>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<p id="dialog1Desc" tabindex="0" class={focusStyle}>
			1. Wähle zwei Karten, um jeweils 5-Sekunden-Ausschnitte abzuspielen.
		</p>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<p id="dialog2Desc" tabindex="0" class={focusStyle}>
			2. Stimmen die Songs überein, verschwinden die Karten; andernfalls werden sie nach 5 Sekunden
			zurückgedreht.
		</p>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<p id="dialog3Desc" tabindex="0" class={focusStyle}>
			3. Bitte achte darauf, dass du einen aktiven Spotify Premium-Account hast. Andernfalls kannst
			du keine Audio-Ausschnitte anhören.
		</p>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<p id="dialog4Desc" tabindex="0" class={focusStyle}>
			4. Nutze zur Steuerg der Tastatur nur die Tab- und Enter- bzw. Leertaste-Steuerung. Mit
			Enter/Leertaste deckst du eine Karte auf.
		</p>
		<button
			type="button"
			aria-label="Spielregeln schließen"
			class={focusStyle +
				' m-6 mx-auto block rounded-2xl border p-2 text-white hover:text-green-600 '}
			onclick={() => dialog.close()}>Verstanden</button
		>
	</dialog>
</div>
