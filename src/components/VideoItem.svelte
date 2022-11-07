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

	$: small = !focus;
</script>

<video
	id={userId}
	src=""
	bind:this={video}
	class:focus
	class:small
	style={`${small}`}
	playsinline
	autoplay
	muted={userId === 'my-stream'}
/>

<style>
	video {
		object-fit: contain;
	}

	.small {
		width: 120px;
		height: 190px;
	}

	.focus {
		width: 100%;
		max-height: 70vh;
	}
</style>
