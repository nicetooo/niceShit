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
		width: 150px;
		height: 230px;
	}

	.focus {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}
</style>
