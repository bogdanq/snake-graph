import { HeuristicProps, HeuristicResul } from "./type";

export function manhattanDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): HeuristicResul {
  return Math.abs(x1 - x) + Math.abs(y1 - y);
}
