import type { GameResult, Owner, WinningPosition } from "../types";

export function getGameResult(game: Owner[] | null): GameResult | null {
  if (!game) return null;
  const alignmentPosition = getAlignmentPosition(game, 1);
  if (alignmentPosition) return { result: "WIN", position: alignmentPosition };
  const alignmentPosition2 = getAlignmentPosition(game, 2);
  if (alignmentPosition2) return { result: "LOST", position: alignmentPosition2 };
  return game.some(value => value === 0) ? null : { result: "FAIR" };
}

const WINNING_COMBINATIONS: WinningPosition[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getAlignmentPosition(game: Owner[], position: 1 | 2) {
  return WINNING_COMBINATIONS.find((combination) => {
    if (
      game[combination[0]] === position &&
      game[combination[1]] === position &&
      game[combination[2]] === position
    ) {
      return combination;
    }
  })
}