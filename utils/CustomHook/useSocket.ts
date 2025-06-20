// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Replace with your actual server URL

type EventCallback = (...args: any[]) => void;

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId },
      autoConnect: true,
      reconnection: true,
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // Emit event
  const emitEvent = (event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  };

  // Listen to event
  const onEvent = (event: string, callback: EventCallback) => {
    socketRef.current?.on(event, callback);
  };

  // Remove listener
  const offEvent = (event: string, callback?: EventCallback) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  };

  return {
    socket: socketRef.current,
    emitEvent,
    onEvent,
    offEvent,
    isConnected: socketRef.current?.connected ?? false,
  };
};
