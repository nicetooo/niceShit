import type Peer from 'peerjs';
import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store';

export const myCode = writable('');
export const myConnId = writable('');
export const myPeer = writable<Peer | null>();
export const myStream = writable<MediaStream>();
export const socketStore = writable<Socket | null>();
export const streams = writable<Record<string, MediaStream>>({});
