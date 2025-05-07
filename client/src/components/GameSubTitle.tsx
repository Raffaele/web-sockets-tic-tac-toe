import type { GameResult } from "../types";

type Props = {
  isMyTime: boolean;
  gameResult: GameResult | null;
};

export const GameSubTitle = ({ gameResult, isMyTime }: Props) => {
  const { result } = gameResult || {};
  switch (result) {
    case "WIN":
      return <div style={{ color: "green" }}>You won!</div>;
    case "LOST":
      return <div style={{ color: "red" }}>You lost!</div>;
    case "FAIR":
      return <div style={{ color: "yellow" }}>Fair!</div>;
    default:
      const msg = isMyTime ? "Your turn" : "Opponents turn";
      return <div>{msg}</div>;
  }
};
