import type Peer from 'peerjs';
import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const myCode = writable('');
export const myConnId = writable('');
export const myPeer = writable<Peer | undefined>();
export const myStream = writable<MediaStream | undefined>();
export const mySocket = writable<Socket | undefined>();
export const streams = writable<Record<string, MediaStream>>({});
