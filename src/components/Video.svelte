<script lang="ts">
	import { onMount } from 'svelte';

	export let srcObject: HTMLVideoElement['srcObject'];
	let video: HTMLVideoElement;

	onMount(() => {
		video.srcObject = srcObject;
	});
</script>

<video src="" bind:this={video} playsinline autoplay muted />

<style>
	video {
		object-fit: contain;
	}
</style>
