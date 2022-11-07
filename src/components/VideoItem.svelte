<script lang="ts">
	import { onMount } from 'svelte';

	export let srcObject: MediaStream;
	export let focus = false;
	export let userId = '';

	let video: HTMLVideoElement;

	onMount(() => {
		video.srcObject = srcObject;
	});

	$: {
		if (video) video.srcObject = srcObject;
	}
	console.log(focus);
</script>

<video
	id={userId}
	src=""
	bind:this={video}
	class:focus
	playsinline
	autoplay
	muted={userId === 'my-stream'}
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
