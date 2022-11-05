<script lang="ts">
	import { Peer } from 'peerjs';
	import { onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';
	import Video from '../components/Video.svelte';

	const API_PATH = 'https://niceshit.up.railway.app';

	let socket: Socket;
	let myConnId: string;
	let myCode: string = '100';
	let peers: Record<string, any> = {};
	let myStream: MediaStream;

	let streams: Record<string, MediaStream> = {};

	const myPeer = new Peer({
		secure: true
	});

	myPeer.on('open', (id) => {
		myConnId = id;
		console.log('conn.id', id);
	});

	myPeer.on('call', (call) => {
		call.answer(myStream);

		call.on('stream', (userVideoStream) => {
			streams[call.peer] = userVideoStream;
		});
	});

	onMount(() => {
		console.log('the component has mounted');

		socket = io('wss://niceshit.up.railway.app');

		socket.on('hello', (arg) => {
			console.log(arg);
		});

		socket.on('user-connected', (peerId) => {
			console.log('user-connected', peerId);
			connectToNewUser(peerId);
		});

		socket.emit('howdy', 'stranger');

		// socket.emit('join-room', 1, 2);
	});

	function handleJoin() {
		if (myConnId && socket && myCode) {
			console.log('joined');
			socket.emit('join-room', myCode, myConnId);
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true
				})
				.then((stream) => {
					myStream = stream;
					streams[myConnId] = stream;
				});
		}
	}

	function connectToNewUser(userId: string) {
		const call = myPeer.call(userId, myStream);
		call.on('stream', (userVideoStream) => {
			console.log('on stream ', userId);
			streams[userId] = userVideoStream;
		});
		call.on('close', () => {
			delete streams[userId];
		});

		peers[userId] = call;
	}
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>

{#each Object.keys(streams) as userId}
	<Video srcObject={streams[userId]} />
{/each}

<div class="call">
	<input placeholder="code" type="text" bind:value={myCode} />
	<button on:click={handleJoin}> call </button>
</div>

<style>
	.call {
		position: fixed;
		bottom: 0;
	}

	.video {
		width: 100%;
		height: 100vh;
		object-fit: contain;
		background-color: black;
	}

	.top {
		position: fixed;
		right: 0;
		width: 220px;
		height: 320px;
		background-color: black;
		border-radius: 5px;
	}
</style>
