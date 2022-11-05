<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let onJoinClick: () => void;
	export let code: Writable<string>;
	export let connId: string;

	let showBtn = connId && $code.length > 7;
	let fullScreen = true;

	code.subscribe((value) => {
		showBtn = connId && value.length > 7;
	});

	function handleJoinClick() {
		fullScreen = false;
		onJoinClick();
	}
</script>

<div class={fullScreen ? 'full-screen' : 'bottom'}>
	<div id="call">
		{#if fullScreen}
			<input id="input" placeholder="code" type="text" bind:value={$code} autocomplete="off" />
		{/if}
		<button id="call-btn" class={showBtn ? 'show' : 'hide'} on:click={handleJoinClick}>
			call
		</button>
	</div>
</div>

<!-- --bg-color: #171717;
--bg-color2: #444444;
--bg-decoration: #da0037;
--font-color: #ededed; -->
<style>
	.full-screen {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
	}

	.bottom {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 90px;
		height: 90px;
		border-radius: 50%;
	}

	.hide {
		transform: scale(0);
		transition: transform 0.2s;
	}

	.show {
		height: 4rem;
		transform: scale(1);
		transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	#call {
		font-family: monospace;
		width: 100%;
		height: 78px;
		max-width: 550px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
	}

	#input {
		font-family: monospace;
		height: 3rem;
		padding: 15px;
		margin: 0 12px;
		font-size: 2rem;
		border-radius: 6px;
		border: none;
		color: #ededed;
		background-color: #444444;
	}

	#input:focus {
		outline: 3px solid #da0037;
	}

	#call-btn {
		font-family: monospace;
		font-size: 2rem;
		border: none;
		color: var(--bg-color);
		background-color: #da0037;
		border-radius: 6px;
		margin-right: 12px;
	}
</style>
