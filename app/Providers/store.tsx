import { generateRandomId } from "@/lib/randomId";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface AppData {
  userId: string;
  // setUserId: Dispatch<SetStateAction<string>>
  players: {
    batsman: string;
    bowler: string;
    innings: number;
    balls: number;
  };
  setPlayers: Dispatch<
    SetStateAction<{
      batsman: string;
      bowler: string;
      innings: number;
      balls: number;
    }>
  >;
  updates: string[];
  setUpdates: Dispatch<SetStateAction<string[]>>;
  actionBoard: {
    player: string;
    status: string;
    choice: number | null;
    runs: number;
  }[];
  setActionBoard: Dispatch<
    SetStateAction<
      {
        player: string;
        status: string;
        choice: number | null;
        runs: number;
      }[]
    >
  >;
  gameOver: boolean;
  setGameOver: Dispatch<SetStateAction<boolean>>;
  resetActionBoard: () => void;
  pickWinGif: () => string;
}

const AppStore = createContext<AppData | null>(null);

export const AppstoreProvider = ({ children }: { children: ReactNode }) => {
  // const [userId, setUserId] = useState<string>("")
  const userId = useMemo(() => generateRandomId(), []);
  const [players, setPlayers] = useState({
    batsman: "",
    bowler: "",
    innings: 1,
    balls: 0,
  });

  const [actionBoard, setActionBoard] = useState<
    {
      player: string;
      status: string;
      choice: number | null;
      runs: number;
    }[]
  >([]);

  const [updates, setUpdates] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const resetActionBoard = () =>
    setActionBoard((prev) =>
      prev.map((item) => ({ ...item, status: "Choosing", choice: null })),
    );

  const pickWinGif = () => {
    const gifs = [
      "/fiery-virat-kohli.gif",
      "/virat-viratkohli.gif",
      "/sniper-msd-dhoni-sniper.gif",
      "/mahendra-singh-dhoni-ms-dhoni.gif",
    ];
    const randomIndex = Math.floor(Math.random() * 4);
    return gifs[randomIndex];
  };

  const data = {
    userId,
    // setUserId
    players,
    setPlayers,
    updates,
    setUpdates,
    actionBoard,
    setActionBoard,
    resetActionBoard,
    gameOver,
    setGameOver,
    pickWinGif,
  };

  return <AppStore.Provider value={data}>{children}</AppStore.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppStore);
  if (!context) {
    throw Error("Wrap the component around the provider first");
  }
  return context;
};
