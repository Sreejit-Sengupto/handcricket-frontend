import { SocketProvider } from "@/Providers/SockerProvider";
import GameRoom from "../room";

const Room = () => {
  return (
    <SocketProvider>
      <GameRoom />
    </SocketProvider>
  );
};

export default Room;
