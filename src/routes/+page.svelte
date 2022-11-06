<script lang="ts">
	import Videos from '../components/Videos.svelte';
	import Call from '../components/Call.svelte';
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>

<div id="app">
	<Videos />
	<Call />
</div>

<style>
	#app {
		display: flex;
		justify-content: center;
		align-items: start;
		width: 100%;
		height: 100%;
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
