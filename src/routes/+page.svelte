<script lang="ts">
	import Videos from '../components/Videos.svelte';
	import Call from '../components/Call.svelte';
	import RTC from '../components/RTC.svelte';
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>

<div id="app">
	<Videos />
	<Call />
	<RTC />
</div>

<style>
	#app {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	:global(body) {
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 20px;
	}
</style>
