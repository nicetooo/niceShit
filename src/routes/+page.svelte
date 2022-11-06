<script lang="ts">
	import { next } from '../store/stream';

	console.log('afanti');
	const colors = ['#ededed', '#FEF9A7', '#FAC213', '#F77E21', '#D61C4E'];
	$: word = '';
	let colorIndex = 0;
	$: color = colors[0];
	function handleClick(e: any) {
		const key = e.target.textContent;
		if (key.length > 1) {
			if (key === word) {
				colorIndex = 0;
				color = colors[colorIndex];
			} else {
				colorIndex += 1;
				color = colors[colorIndex % 4];
			}

			word = '';
			console.log(word, color, colorIndex);
			return;
		}

		word += key;
		console.log(word);

		if (word.includes('NAI') && word.length > 5 && key === 'I') {
			location.href = '/' + $next;
		}
	}
</script>

<svelte:head>
	<title>afanti</title>
</svelte:head>

<div class="afanti" on:click={handleClick} style={`color: ${color}`}>
	<div class="h1">A</div>
	<div class="h1">F</div>
	<div class="h1">A</div>
	<div class="h1">N</div>
	<div class="h1">T</div>
	<div class="h1">I</div>
</div>

<style>
	h1 {
		letter-spacing: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.h1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		font-size: 2em;
		margin-block-start: 0.67em;
		margin-block-end: 0.67em;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
		font-weight: bold;
	}
	.afanti {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color: var(--font-color);
	}

	:global(body) {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 20px;
	}
</style>
