<script>
	import { Peer } from 'peerjs';
	import { onMount } from 'svelte';
	const myPeer = new Peer();
	const streams = {};
	let myStream;

	onMount(() => {
		console.log('the component has mounted');
		const videoGrid = document.getElementById('video-grid');
		const myVideo = document.getElementsByTagName('video')[0];
		handleCall();
		myVideo.muted = true;
		// navigator.mediaDevices
		// 	.getUserMedia({
		// 		video: true,
		// 		audio: true
		// 	})
		// 	.then((stream) => {
		// 		debugger;
		// 		myStream = stream;
		// 		addVideoStream(myVideo, stream);
		// 	});

		var conn = myPeer.connect('another-peers-id');
		// on open will be launch when you successfully connect to PeerServer
		conn.on('open', function () {
			// here you have conn.id
			console.log('conn.id', conn.id);
			conn.send('hi!');
		});

		myPeer.on('connection', function (conn) {
			conn.on('data', function (data) {
				// Will print 'hi!'
				console.log(data);
			});
		});
	});

	function handleCall() {
		myPeer.on('call', (call) => {
			console.log({ call });
			call.answer(myStream);
			// const video = document.createElement('video');
			call.on('stream', (userVideoStream) => {
				console.log({ userVideoStream });
				// addVideoStream(video, userVideoStream);
			});
		});
	}

	function addVideoStream(video, stream) {
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
	}
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>
<h1>Welcome to nice shit</h1>
<div id="video-grid">
	<video src="" />
</div>

<style>
	#video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 300px);
		grid-auto-rows: 300px;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
