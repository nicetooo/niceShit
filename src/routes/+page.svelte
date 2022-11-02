<script lang="ts">
	import { Peer } from 'peerjs';
	import { onMount } from 'svelte';

	$: streams = {};
	let myVideo: HTMLVideoElement;
	let myStream: any;
	let myConnId: string;
	let connId: string;
	let buttomVideo: HTMLVideoElement;

	const myPeer = new Peer();
	myPeer.on('open', (id) => {
		myConnId = id;
		console.log('conn.id', id);
	});

	myPeer.on('call', (call) => {
		console.log('get call');
		call.answer(myStream);
		call.on('stream', (userVideoStream) => {
			console.log('get stream');
			buttomVideo.srcObject = userVideoStream;
			buttomVideo.addEventListener('loadedmetadata', () => {
				buttomVideo.play();
			});
		});
	});

	onMount(() => {
		console.log('the component has mounted');
		myVideo.muted = true;
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true
			})
			.then((stream) => {
				myStream = stream;
				addVideoStream(myVideo, stream);
			});
	});

	function RTCVideoCall() {
		const call = myPeer.call(connId, myStream);
		call.on('stream', (userVideoStream: MediaStream) => {
			console.log('get stream back');
			buttomVideo.srcObject = userVideoStream;
			buttomVideo.addEventListener('loadedmetadata', () => {
				buttomVideo.play();
			});
		});
	}

	function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
	}

	function switchVideoSrcObject() {
		const topSrc = myVideo.srcObject;
		myVideo.srcObject = buttomVideo.srcObject;
		buttomVideo.srcObject = topSrc;
		myVideo.addEventListener('loadedmetadata', () => {
			myVideo.play();
		});
		buttomVideo.addEventListener('loadedmetadata', () => {
			buttomVideo.play();
		});
		buttomVideo.muted = true;
	}

	function copyConnId() {
		navigator.clipboard.writeText(myConnId);
	}
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>
<video class="video top" bind:this={myVideo} src="" on:click={switchVideoSrcObject} />
<video class="video" bind:this={buttomVideo} src="" />

<div class="call">
	<h4 on:click={copyConnId}>connection id: {myConnId}</h4>
	<input placeholder="connection to" type="text" bind:value={connId} />
	<button on:click={RTCVideoCall}> call </button>
</div>

<style>
	.call {
		position: fixed;
		bottom: 0;
	}

	.video {
		width: 100vw;
		height: 100vh;
		object-fit: cover;
		background-color: blue;
	}

	.top {
		position: fixed;
		right: 0;
		width: 220px;
		height: 320px;
		object-fit: cover;
		background-color: pink;
		border-radius: 5px;
	}
</style>
