<script lang="ts">
	import { onMount } from 'svelte';
	import { myConnId } from '../store/stream';

	export let srcObject: MediaStream;
	export let id: string;
	export let focus = false;
	export let userId = '';

	let video: HTMLVideoElement;

	onMount(() => {
		video.srcObject = srcObject;
	});
	console.log(focus);
</script>

<video
	{id}
	src=""
	bind:this={video}
	class:focus
	playsinline
	autoplay
	muted={userId === $myConnId}
/>

<style>
	video {
		width: 50%;
		object-fit: contain;
	}

	.focus {
		width: 100%;
	}
</style>
