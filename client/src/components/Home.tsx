import { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import type { GameResult, Owner, SocketMessage, User } from "../types";
import { Player } from "./Player";
import { Game } from "./Game";
import { getGameResult } from "../features/getGameResult";

const SOCKET_URL = "ws://localhost:3000";

type Props = {
  userName: string;
  onLogout: () => void;
};

export const Home = ({ userName, onLogout }: Props) => {
  const [isMyTime, setIsMyTime] = useState(false);
  const [game, setGame] = useState<Owner[] | null>(null);
  const gameResult = useMemo<GameResult | null>(
    () => getGameResult(game),
    [game]
  );

  const [users, setUsers] = useState<User[]>([]);
  const [currentUuid, setCurrentUuid] = useState<string | null>(null);
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<SocketMessage>(
    SOCKET_URL,
    {
      queryParams: {
        userName,
      },
    }
  );

  const startChallenge = useCallback(
    (uuid: string) => {
      setIsMyTime(true);
      sendJsonMessage({
        uuid,
        action: "startChallenge",
      });
    },
    [sendJsonMessage]
  );

  useEffect(() => {
    if (!lastJsonMessage) return;
    if (lastJsonMessage.action === "setup") {
      setCurrentUuid(lastJsonMessage.uuid);
      setUsers(
        lastJsonMessage.existingConnections.map(
          ({ uuid, userName, playingWith }) => ({
            uuid,
            userName,
            playingWith,
          })
        )
      );
      return;
    }

    if (lastJsonMessage.action === "disconnect") {
      setUsers((oldUsers) =>
        oldUsers.filter(({ uuid }) => uuid !== lastJsonMessage.uuid)
      );
      return;
    }
    if (lastJsonMessage.action === "connect") {
      setUsers((oldUsers) => [
        ...oldUsers,
        {
          uuid: lastJsonMessage.uuid,
          userName: lastJsonMessage.userName,
          playingWith: null,
        },
      ]);

      return;
    }
    if (lastJsonMessage.action === "startChallenge") {
      setGame(Array.from({ length: 9 }, () => 0));
      setUsers((oldUsers) =>
        oldUsers.map((user) => {
          const index = lastJsonMessage.uuids.findIndex(
            (uuid) => uuid === user.uuid
          );
          if (index === -1) return user;
          return { ...user, playingWith: lastJsonMessage.uuids[1 - index] };
        })
      );

      return;
    }
    if (lastJsonMessage.action === "exitChallenge") {
      setIsMyTime(false);
      setGame(null);
      setUsers((oldUsers) =>
        oldUsers.map((user) => {
          const index = lastJsonMessage.uuids.findIndex(
            (uuid) => uuid === user.uuid
          );
          if (index === -1) return user;
          return { ...user, playingWith: null };
        })
      );
      return;
    }
    if (lastJsonMessage.action === "playStep") {
      setGame((oldGame) => {
        if (!oldGame) return null;
        const newGame = [...oldGame];
        newGame[lastJsonMessage.position] = 2;
        setIsMyTime(true);
        return newGame;
      });
      return;
    }
    console.table(lastJsonMessage);
  }, [lastJsonMessage, setGame, setIsMyTime]);

  const onExitChallenge = useCallback(() => {
    sendJsonMessage({
      uuid: currentUuid,
      action: "exitChallenge",
    });
  }, [sendJsonMessage, currentUuid]);

  const playAtPosition = useCallback(
    (position: number) => {
      if (!isMyTime || gameResult) return;
      setGame((oldGame) => {
        if (!oldGame) return null;
        if (oldGame[position] !== 0) return oldGame;
        const newGame = [...oldGame];
        newGame[position] = 1;
        setIsMyTime(false);
        sendJsonMessage({
          position,
          action: "playPosition",
        });
        return newGame;
      });
    },
    [isMyTime, setGame, setIsMyTime, sendJsonMessage, gameResult]
  );

  return (
    <div>
      <h1>Hello {userName}</h1>
      {game ? (
        <Game
          onChallengeEnd={onExitChallenge}
          playAtPosition={playAtPosition}
          isMyTime={isMyTime}
          game={game}
          gameResult={gameResult}
        />
      ) : (
        <ol>
          {users.map(({ uuid, userName, playingWith }) => (
            <Player
              key={uuid}
              userName={userName}
              startChallenge={() => startChallenge(uuid)}
              playingWith={playingWith}
            />
          ))}
        </ol>
      )}

      <button type="button" onClick={onLogout} title="logout">
        Logout
      </button>
    </div>
  );
};
