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