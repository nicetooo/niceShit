<script lang="ts">
	import { Peer } from 'peerjs';
	import { onMount } from 'svelte';

	const API_PATH = 'https://niceshit.up.railway.app';

	let streams: any = {};
	let myVideo: HTMLVideoElement;
	let myStream: any;
	let myConnId: string;
	let connId: string;
	let myCode: string;
	let buttomVideo: HTMLVideoElement;
	let peers: string[] = [];

	const myPeer = new Peer({
		secure: true
	});

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
		// navigator.mediaDevices
		// 	.getUserMedia({
		// 		video: true,
		// 		audio: true
		// 	})
		// 	.then((stream) => {
		// 		myStream = stream;
		// 		addVideoStream(myVideo, stream);
		// 	});
	});

	function RTCVideoCall(connId: string) {
		const call = myPeer.call(connId, myStream);
		call.on('stream', (userVideoStream: MediaStream) => {
			console.log('get stream back');
			buttomVideo.srcObject = userVideoStream;
			buttomVideo.addEventListener('loadedmetadata', () => {
				buttomVideo.play();
			});
		});

		call.on('error', (error) => {
			console.error('RTCVideoCall', error);
			peers = peers.filter((p) => p !== connId);
		});
	}

	function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.playsInline = true;
			video.muted = true;
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
		buttomVideo.playsInline = true;
		buttomVideo.muted = true;
	}

	function copyConnId() {
		navigator.clipboard.writeText(myConnId);
	}

	async function checkAllMember(members?: any) {
		let membersList = members;
		let hasEmptyPeerId = false;
		if (!membersList) {
			const res = await fetch(`${API_PATH}/member/`);
			membersList = await res.json();
		}
		membersList.forEach((member: any) => {
			const { peerId } = member;

			if (!peerId) {
				hasEmptyPeerId = true;
			}

			if (peerId && !peers.includes(peerId) && peerId !== myConnId) {
				RTCVideoCall(peerId);
				peers.push(peerId);
			}
		});

		if (hasEmptyPeerId) {
			setTimeout(checkAllMember, 5000);
		}
	}

	async function checkCode() {
		const res = await fetch(`${API_PATH}/member/${myCode}`);
		const { error, code } = await res.json();
		if (error) {
			console.error('checkCode error', error);
			return false;
		}

		if (code === myCode) {
			console.log('checkCode pass');
			return true;
		}

		return false;
	}

	async function joinRoom() {
		const res = await fetch(`${API_PATH}/member/${myCode}/join/${myConnId}`, { method: 'PATCH' });
		const data = await res.json();
		console.log('join room, res', data);
		checkAllMember(data);
	}

	async function handleJoin() {
		if (myConnId && (await checkCode())) {
			console.log('joined');
			joinRoom();
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true
				})
				.then((stream) => {
					myStream = stream;
					addVideoStream(myVideo, stream);
				});
		}
	}
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>
<video
	class="video top"
	bind:this={myVideo}
	src=""
	on:click={switchVideoSrcObject}
	autoplay
	playsinline
	muted
/>
<video class="video" bind:this={buttomVideo} src="" autoplay playsinline muted />

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
		object-fit: cover;
		background-color: pink;
		border-radius: 5px;
	}
</style>
