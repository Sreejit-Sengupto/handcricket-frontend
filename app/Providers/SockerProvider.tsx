import {
  useContext,
  createContext,
  type ReactNode,
  useState,
  useEffect,
  useRef,
  type RefObject,
} from "react";
import { useParams } from "react-router";
import { useAppStore } from "./store";

interface TSocketType {
  socketRef: RefObject<WebSocket | null>;
  // socket: WebSocket | null
  isConnected: boolean;
  joinRoom: (roomId: string, playerId: string) => boolean;
  sendChoice: (roomId: string, playerId: string, choice: number) => boolean;
  connectToSocket: () => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<TSocketType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  // const [socket, setSocket] = useState<WebSocket | null>(null)
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessage, setReceivedMessages] = useState<string[]>([]);

  const { setActionBoard } = useAppStore();
  const params = useParams();

  const joinRoom = (roomId: string, playerId: string) => {
    const joinRoomMessage = {
      type: "JOIN_ROOM",
      roomId,
      playerId,
    };
    if (!socketRef.current) {
      console.error("Socket not connected");
      return false;
    }
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(joinRoomMessage));
      return true;
    }
    console.warn("Not connected. Message not sent.");
    return false;
  };

  const sendChoice = (roomId: string, playerId: string, choice: number) => {
    const sendChoiceMessage = {
      type: "PLAYER_CHOICE",
      roomId,
      playerId,
      choice,
    };
    if (!socketRef.current) {
      console.error("Socket not connected");
      return false;
    }
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(sendChoiceMessage));
      return true;
    }
    console.warn("Not connected. Choice Message not sent.");
    return false;
  };

  const disconnectSocket = () => {
    if (!socketRef.current) {
      console.error("Socket not connected");
      return false;
    }
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
      return true;
    }
    console.warn("Failed to disconnect.");
    return false;
  };

  // useEffect(() => {
  //     const newSocket = new WebSocket('ws://localhost:8000')
  //     newSocket.onopen = () => {
  //         console.log('✅ WebSocket connected');
  //         // setSocket(newSocket)
  //         socketRef.current = newSocket;
  //         // console.log(socketRef.current);
  //     };

  //     newSocket.onclose = () => {
  //         console.log('❌ WebSocket disconnected');
  //     };

  //     newSocket.onerror = (error) => {
  //         console.error('WebSocket error:', error);
  //     };

  //     return () => {
  //         newSocket.close()
  //     }
  // }, [])

  // useEffect(() => {
  //     if (!socketRef.current) {
  //         socketRef.current = new WebSocket('ws://localhost:8000')

  //         socketRef.current.onopen = () => {
  //             console.log('WebSocket connected! ✅');
  //             setIsConnected(true);
  //         }

  //         socketRef.current.onclose = () => {
  //             console.log('WebSocket disconnected. ❌');
  //             setIsConnected(false); // Trigger re-render for UI update
  //             // socketRef.current = null; // Clean up the ref
  //         };

  //         socketRef.current.onerror = (error) => {
  //             console.error('WebSocket error:', error);
  //         };

  //         socketRef.current.onmessage = (event) => {
  //             console.log('Received message:', event.data);
  //             // Trigger re-render to display the new message
  //             setReceivedMessages((prev) => [...prev, event.data]);
  //             setIsConnected(true)
  //         };
  //     }

  //     return () => {
  //         if (socketRef.current) {
  //             socketRef.current.close();
  //         }
  //     };
  // }, [params])

  const connectToSocket = () => {
    if (!socketRef.current) {
      // socketRef.current = new WebSocket('ws://localhost:8000')
      socketRef.current = new WebSocket("ws://10.232.78.2:8000");

      socketRef.current.onopen = () => {
        console.log("WebSocket connected! ✅");
        setIsConnected(true);
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected. ❌");
        setIsConnected(false); // Trigger re-render for UI update
        // socketRef.current = null; // Clean up the ref
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socketRef.current.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Trigger re-render to display the new message
        setReceivedMessages((prev) => [...prev, event.data]);
        setIsConnected(true);
      };
    }
  };

  const data = {
    socketRef,
    joinRoom,
    isConnected,
    connectToSocket,
    sendChoice,
    disconnectSocket,
  };

  return (
    <SocketContext.Provider value={data}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw Error("Wrap the component first");
  }
  return context;
};
