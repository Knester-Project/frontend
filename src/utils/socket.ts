import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const initSocket = () => {
    if (socket) return socket;

    socket = io(VITE_SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export function getTimeLeft(target: string | Date) {
    const total = new Date(target).getTime() - Date.now();
    if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { total, days, hours, minutes, seconds, past: false };
}