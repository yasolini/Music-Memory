<script>
	import Header from './header.svelte';
</script>

<div class="flex h-screen w-full flex-col bg-slate-900">
	<Header />

	<h1 class="  p-7 text-center text-4xl text-white">Willkommen bei Music Memory</h1>

	<div class=" px-6 text-lg text-white">
		<h2 class=" p-6 text-center text-3xl">Spiele Memory mit Songs aus deiner Spotify-Playlist!</h2>
	</div>
	<div class="flex items-center justify-center pb-16">
		<ul class="w-2/5 list-inside list-disc space-y-4 p-4 text-2xl text-white">
			<li>Verbinde dich mit deinem Spotify Premium Account</li>
			<li>Spiele mit deiner eigenen Playlist</li>
			<li>Oder starte mit einer Zufallsplaylist</li>
			<li>Solo-Spiel – ideal für zwischendurch</li>
			<li>Beste Unterhaltung mit deiner Musik!</li>
		</ul>
	</div>
	<div class="flex items-center justify-center">
		<button class="mr-20 rounded-xl bg-slate-700 p-6 text-2xl text-white hover:bg-blue-900"
			>Play ohne Spotify</button
		>
		<a
			class="ml-20 rounded-xl bg-slate-700 p-6 text-2xl text-white hover:bg-blue-900"
			href="/fertig/game">Play mit Spotify Premium</a
		>
	</div>
</div>
