import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingDock } from "@/components/ui/floating-dock";
import { cn } from "@/lib/utils";
import { useSocket } from "@/Providers/SockerProvider";
import { useAppStore } from "@/Providers/store";
import { ArrowLeftCircle, Dot, HomeIcon, MoveLeftIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

const GameRoom = () => {
  const params = useParams();
  const roomId = params.roomId;

  const {
    socketRef,
    isConnected,
    joinRoom,
    connectToSocket,
    sendChoice,
    disconnectSocket,
  } = useSocket();
  const {
    userId,
    setPlayers,
    players,
    updates,
    setUpdates,
    actionBoard,
    setActionBoard,
    resetActionBoard,
    gameOver,
    setGameOver,
    pickWinGif,
  } = useAppStore();

  console.log(players);
  console.log(actionBoard);

  if (!roomId) {
    return null;
  }

  useEffect(() => {
    connectToSocket();
    const socket = socketRef.current;
    if (socket && isConnected) {
      socket.onmessage = (message) => {
        console.log(message);
        const parsedMessage = JSON.parse(message.data);
        console.log(parsedMessage);

        console.log(parsedMessage.type === "UPDATE_GAME");

        if (parsedMessage.type === "UPDATE_GAME") {
          if (typeof parsedMessage.message === "string") {
            console.log("Updating...");
            console.log(parsedMessage.message);
            console.log("P1: ", players.batsman);
            console.log("P2: ", players.bowler);

            const playerId = parsedMessage.message;
            console.log(playerId === playerId);
            // setActionBoard(prev => prev.map(item => item.player !== playerId ? { ...item, status: 'Chosen', choice: null } : { ...item, status: 'Choosing', choice: null }))

            setActionBoard((prev) =>
              prev.map((item) => {
                const matchedPlayer = item.player === playerId;
                if (matchedPlayer) {
                  return {
                    ...item,
                    // choice: matchedPlayer.choice,
                    status: "Choosing",
                    choice: null,
                  };
                }
                // return { ...item, status: 'Choosing', choice: null }
                return { ...item, status: "Chosen", choice: null };
              }),
            );
          } else {
            const innings = parsedMessage.message.innings;
            // if (innings === 2) {
            //     resetActionBoard()
            // }
            const playerData = parsedMessage.message.playersScore as {
              player: string;
              runs: number;
              role: string;
              choice: number;
            }[];

            // setActionBoard(prev => prev.map(item => item.player === playerData[0].player ? { ...item, choice: playerData[0].choice } : { ...item, choice: playerData[1].choice }))

            setActionBoard((prev) =>
              prev.map((item) => {
                const matchedPlayer = playerData.find(
                  (p) => p.player === item.player,
                );
                if (matchedPlayer) {
                  return {
                    ...item,
                    choice: matchedPlayer.choice,
                    status: "Chosen",
                    runs: matchedPlayer.runs,
                  };
                }
                // return { ...item, status: 'Choosing', choice: null }
                return item;
              }),
            );
            setPlayers((prev) => {
              if (innings === prev.innings) {
                return {
                  ...prev,
                  balls: prev.balls + 1,
                };
              } else {
                resetActionBoard();
                return {
                  ...prev,
                  batsman: prev.bowler,
                  bowler: prev.batsman,
                  innings: innings,
                  balls: 0,
                };
              }
            });
          }
          console.log(actionBoard);
        }

        if (parsedMessage.type === "MESSAGE") {
          toast.info(parsedMessage.message, {
            position: "top-center",
          });
          setUpdates((prev) => [...prev, parsedMessage.message]);
        }

        if (parsedMessage.type === "START_GAME") {
          setPlayers({
            batsman: parsedMessage.message.batsman,
            bowler: parsedMessage.message.bowler,
            innings: 1,
            balls: 0,
          });
          setActionBoard([
            {
              player: parsedMessage.message.batsman,
              status: "Choosing",
              choice: null,
              runs: 0,
            },
            {
              player: parsedMessage.message.bowler,
              status: "Choosing",
              choice: null,
              runs: 0,
            },
          ]);
        }

        if (parsedMessage.type === "GAME_OVER") {
          const playerData = parsedMessage.message.playersScore as {
            player: string;
            runs: number;
            role: string;
            choice: number;
          }[];

          const winningMessage = parsedMessage.message.result as string;
          const winnerId = winningMessage
            .substring(
              winningMessage.indexOf(" "),
              winningMessage.indexOf("wins"),
            )
            .trim();
          console.log("Winner: ", winnerId);

          setActionBoard((prev) =>
            prev.map((item) => {
              const matchedPlayer = playerData.find(
                (p) => p.player === item.player,
              );
              if (matchedPlayer) {
                return {
                  ...item,
                  choice: matchedPlayer.choice,
                  status: matchedPlayer.player === winnerId ? "W" : "L",
                  runs: matchedPlayer.runs,
                };
              }
              // return { ...item, status: 'Choosing', choice: null }
              setPlayers((prev) => ({ ...prev, balls: prev.balls + 1 }));
              return item;
            }),
          );

          // alert(parsedMessage.message.result)
          setGameOver(true);
        }
      };

      if (roomId && userId) {
        joinRoom(roomId, userId);
      }
    }
  }, [socketRef, isConnected, userId]);

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-teal-400 to-green-400 via-green-300 text-white p-3 flex flex-col">
      <div className="flex justify-between items-center mb-5 relative">
        <Link to={"/"}>
          <ArrowLeftCircle size={32} />
        </Link>
        <Button>Invite</Button>
      </div>
      {!players.batsman || !players.bowler ? (
        <Card className="bg-[#FFFAF0]">
          <CardContent>Waiting for other player to join</CardContent>
        </Card>
      ) : (
        <div>
          <div className="md:grid md:grid-cols-5 md:gap-2 md:min-h-[30rem]">
            <div className="col-span-3">
              <Card className="bg-[#FFFAF0] shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <p className="md:text-3xl">Scoreboard</p>
                    <p className="flex justify-center items-center">
                      <Dot className="w-10 h-10 text-red-600 animate-caret-blink" />
                      <span className="font-bold -ml-3">LIVE</span>
                    </p>
                  </CardTitle>
                  <CardDescription className="flex justify-center items-center gap-1 md:text-xl">
                    <span
                      className={cn(
                        "font-bold",
                        players.batsman === userId && "text-blue-600",
                      )}
                    >
                      {players.batsman}
                    </span>
                    <span className="text-lg md:text-2xl md:font-bold">
                      v/s
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        players.bowler === userId && "text-blue-600",
                      )}
                    >
                      {players.bowler}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-around items-center text-sm">
                  <div>
                    <p className="text-xl md:text-2xl font-semibold mb-2">
                      Batting{" "}
                      {actionBoard.find(
                        (item) => item.player === players.batsman,
                      )?.status === "W" && "(W)"}
                    </p>
                    <span
                      className={cn(
                        "font-semibold text-xs md:text-lg",
                        players.batsman === userId && "text-blue-600",
                      )}
                    >
                      {players.batsman}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-xs md:text-lg">
                      {
                        actionBoard.find(
                          (item) => item.player === players.batsman,
                        )?.runs
                      }
                      ({players.balls})
                    </span>
                  </div>
                  <div className="border-l-2 border-r-2 text-xl font-bold p-3">
                    -
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-semibold mb-2">
                      Bowling{" "}
                      {actionBoard.find(
                        (item) => item.player === players.bowler,
                      )?.status === "W" && "(W)"}
                    </p>
                    <span
                      className={cn(
                        "font-semibold text-xs md:text-lg",
                        players.bowler === userId && "text-blue-600",
                      )}
                    >
                      {players.bowler}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-xs md:text-lg">
                      60 km/h
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2justify-center items-center text-xl font-semibold uppercase">
                  <p>{players.innings === 1 ? "1st" : "2nd"} Innings</p>
                  {players.innings === 2 && (
                    <p>
                      Target:{" "}
                      {actionBoard.find((p) => p.player === players.bowler)!
                        .runs + 1}
                    </p>
                  )}
                </CardFooter>
              </Card>

              <Card className="mt-5 bg-[#FFFAF0]">
                <CardHeader>
                  <CardTitle>Player Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 place-items-center">
                    <div className="w-full text-center border-r">
                      <p
                        className={cn(
                          "font-semibold",
                          players.batsman === userId && "text-blue-600",
                        )}
                      >
                        {players.batsman === userId
                          ? "You (Batting)"
                          : players.batsman}
                      </p>
                      {(() => {
                        const batsmanBoard = actionBoard.find(
                          (p) => p.player === players.batsman,
                        );
                        return (
                          <div className="w-full text-center border-r">
                            <p
                              className={cn(
                                batsmanBoard?.status === "Chosen"
                                  ? "text-green-600"
                                  : batsmanBoard?.status === "Choosing"
                                    ? "text-primary"
                                    : "text-black",
                              )}
                            >
                              {batsmanBoard?.choice === null
                                ? batsmanBoard?.status
                                : batsmanBoard?.choice}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="w-full text-center border-l">
                      <p
                        className={cn(
                          "font-semibold",
                          players.bowler === userId && "text-blue-600",
                        )}
                      >
                        {players.bowler === userId
                          ? "You (Bowling)"
                          : players.bowler}
                      </p>
                      {(() => {
                        const bowlerBoard = actionBoard.find(
                          (p) => p.player === players.bowler,
                        );
                        return (
                          <div className="w-full text-center border-r">
                            <p
                              className={cn(
                                bowlerBoard?.status === "Chosen"
                                  ? "text-green-600"
                                  : bowlerBoard?.status === "Choosing"
                                    ? "text-primary"
                                    : "text-black",
                              )}
                            >
                              {bowlerBoard?.choice === null
                                ? bowlerBoard?.status
                                : bowlerBoard?.choice}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="hidden md:block col-span-2 shadow-2xl">
              <CardHeader>
                <CardTitle>Chat</CardTitle>
              </CardHeader>
              <CardContent>
                {updates.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* <div className='border border-red-500 mt-auto'>

                        <FloatingDock
                            // mobileClassName="translate-y-20" // only for demo, remove for production
                            mobileClassName=''
                            items={[
                                {
                                    title: '1',
                                    icon: <p>1</p>,
                                    onClick: () => sendChoice(roomId, userId, 1),
                                },
                                {
                                    title: '2',
                                    icon: <p>2</p>,
                                    onClick: () => sendChoice(roomId, userId, 2),
                                },
                                {
                                    title: '3',
                                    icon: <p>3</p>,
                                    onClick: () => sendChoice(roomId, userId, 3),
                                },
                                {
                                    title: '4',
                                    icon: <p>4</p>,
                                    onClick: () => sendChoice(roomId, userId, 4),
                                },
                                {
                                    title: '5',
                                    icon: <p>5</p>,
                                    onClick: () => sendChoice(roomId, userId, 5),
                                },
                                {
                                    title: '6',
                                    icon: <p>6</p>,
                                    onClick: () => sendChoice(roomId, userId, 6),
                                },
                            ]}

                        />
                    </div> */}
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 mt-auto mx-auto">
        <Button
          onClick={() => sendChoice(roomId, userId, 1)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          1
        </Button>
        <Button
          onClick={() => sendChoice(roomId, userId, 2)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          2
        </Button>
        <Button
          onClick={() => sendChoice(roomId, userId, 3)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          3
        </Button>
        <Button
          onClick={() => sendChoice(roomId, userId, 4)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          4
        </Button>
        <Button
          onClick={() => sendChoice(roomId, userId, 5)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          5
        </Button>
        <Button
          onClick={() => sendChoice(roomId, userId, 6)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer"
        >
          6
        </Button>
      </div>

      {gameOver && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full flex justify-center items-center">
          <Card className="bg-gradient-to-br from-gray-700/20 to-gray-300/20 via-gray-500/20 backdrop-blur-xs w-[80%] lg:w-[50%] h-[50%] rounded-2xl border border-black/35 z-40">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-red-500">
                GAME OVER
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-3">
              <div className="w-44 h-44 lg:w-64 lg:h-64 object-contain">
                <img
                  src={pickWinGif()}
                  height={48}
                />
              </div>
              <p className="text-2xl text-green-700 font-semibold">
                {actionBoard.find((item) => item.status === "W")?.player}{" "}
                WINS!!🎉🎉
              </p>
            </CardContent>
            <CardFooter className="flex justify-center items-center gap-3">
              <Button
                className="w-32 h-10 cursor-pointer"
                onClick={() => {
                  joinRoom(roomId, userId);
                  setGameOver(false);
                }}
              >
                PLAY AGAIN
              </Button>
              <Button
                variant={"destructive"}
                className="w-32 h-10 cursor-pointer"
              >
                <Link to={"/"}>EXIT</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
