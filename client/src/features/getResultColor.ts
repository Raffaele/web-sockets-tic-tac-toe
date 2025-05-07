import type { CSSProperties } from "react";
import type { GameResult } from "../types";

export function getResultColor(gameResult: GameResult | null): CSSProperties['color'] | undefined {
  if (!gameResult) return undefined;
  if (gameResult.result === "WIN") return "green";
  if (gameResult.result === "LOST") return "red";
  return "yellow";
}
