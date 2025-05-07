import { useEffect, useState, type CSSProperties } from "react";
import { getResultColor } from "../features/getResultColor";
import type { GameResult, Owner } from "../types";
import { GameSubTitle } from "./GameSubTitle";

type Props = {
  onChallengeEnd: () => void;
  onGameReset: () => void;
  playAtPosition: (position: number) => void;
  isMyTime: boolean;
  game: Owner[];
  gameResult: GameResult | null;
};

function getValue(owner: Owner): string {
  if (owner === 1) return "X";
  if (owner === 2) return "O";
  return "";
}

const genericCellStyle: CSSProperties = {
  border: "1px solid black",
  width: 50,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function getCellStyle(
  position: number,
  gameResult: GameResult | null
): CSSProperties {
  if (!gameResult || gameResult.result === "FAIR") return genericCellStyle;
  const cellColor = getResultColor(gameResult);
  if (gameResult.position.includes(position)) {
    return {
      ...genericCellStyle,
      color: cellColor,
    };
  }

  return {
    ...genericCellStyle,
  };
}

export const Game = ({
  onChallengeEnd,
  playAtPosition,
  game,
  isMyTime,
  gameResult,
  onGameReset,
}: Props) => {
  const [isReadyForReset, setIsReadyForReset] = useState(false);
  useEffect(() => {
    if (!gameResult) return;
    setTimeout(() => setIsReadyForReset(true), 2000);
  }, [setIsReadyForReset, gameResult]);
  return (
    <div>
      <div style={{ textAlign: "center", display: "inline-block" }}>
        <GameSubTitle gameResult={gameResult} isMyTime={isMyTime} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {game.map((value, i) => (
            <div
              key={i}
              style={getCellStyle(i, gameResult)}
              onClick={() => playAtPosition(i)}
            >
              {getValue(value)}
            </div>
          ))}
        </div>
        {isReadyForReset && <button onClick={onGameReset}>Reset</button>}
        <button onClick={onChallengeEnd}>Exit challenge</button>
      </div>
    </div>
  );
};
