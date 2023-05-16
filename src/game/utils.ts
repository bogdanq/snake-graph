import { CONSTANTS } from "../constants";
import { Snake } from "../game";
import { getPositionByIndex } from "../graph";
import { shakeHead } from "../snake-helpers";
import { Coords, DIRECTIONS } from "../types";

/**
 * Получение следующей позиции (по графу)
 * @param snake - обьект змеи
 * @param {number} direction - направление движения
 */
export function getNextPositionByDirection(
  snake: Snake,
  direction: number
): Coords {
  const [x, y] = getPositionByIndex(shakeHead(snake)[0]);

  switch (direction) {
    case DIRECTIONS.LEFT:
      return [x - 1, y];
    case DIRECTIONS.RIGHT:
      return [x + 1, y];
    case DIRECTIONS.TOP:
      return [x, y - 1];
    case DIRECTIONS.DOWN:
      return [x, y + 1];
    default:
      return [x, y];
  }
}

/**
 * Получение следующей позиции (по графу)
 * @param snake - обьект змеи
 * @param {number} x - позиция по оси x (на основе графа)
 * @param {number} y - позиция по оси y (на основе графа)
 */
export function checkBounds([x, y]: Coords): Coords {
  const w = CONSTANTS.getHorizontalCellCount();
  const h = CONSTANTS.getVerticalCellCount();

  if (y >= h) {
    y = h - 1;
  }

  if (y < 0) {
    y = 0;
  }

  if (x < 0) {
    x = 0;
  }

  if (x >= w) {
    x = w - 1;
  }

  return [x, y];
}
