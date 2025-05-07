import type { Owner } from "../types";

type Props = {
  onChallengeEnd: () => void;
  playAtPosition: (position: number) => void;
  isMyTime: boolean;
  game: Owner[];
};

function getValue(owner: Owner): string {
  if (owner === 1) return "X";
  if (owner === 2) return "O";
  return "";
}

export const Game = ({
  onChallengeEnd,
  playAtPosition,
  game,
  isMyTime,
}: Props) => {
  const turn = isMyTime ? "Your turn" : "Opponents turn";
  return (
    <div style={{ textAlign: "center", display: "inline-block" }}>
      <div>{turn}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {game.map((value, i) => (
          <div
            key={i}
            style={{
              border: "1px solid black",
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => playAtPosition(i)}
          >
            {getValue(value)}
          </div>
        ))}
      </div>
      <button onClick={onChallengeEnd}>Exit challenge</button>
    </div>
  );
};
