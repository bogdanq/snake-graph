import Color from "color";
import random from "lodash-es/random";
import { CONSTANTS } from "../constants";
import { Snake } from "../game";
import { getPositionByIndex, randomId } from "../graph";
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

const colorsStub = [
  "#f48fb1",
  "#ec407a",
  "#c2185b",
  "#b71c1c",
  "#ba68c8",
  "#8e24aa",
  "#26c6da",
  "#9ccc65",
  "#c0ca33",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
];

/**
 * Получение головы змеи (конец массива)
 */
export const shakeHead = (snake: Snake): [number, string] => {
  if (!snake) return [0, ""];

  return snake.body[snake.body.length - 1] || [];
};

/**
 * Получение хвоста змеи (первый елемент)
 */
export const shakeTail = (snake: Snake) => {
  return snake.body[0];
};

/**
 * Смена направления змеи
 */
export const handleSetDirection = (
  snake: Snake,
  direction: DIRECTIONS
): Snake => {
  return { ...snake, direction };
};

/**
 * Получение еды (когда голова на ее вершине)
 */
export const handleEatFood = (snake: Snake, foodId: number): Snake => {
  return {
    ...snake,
    body: [...snake.body, [foodId, randomId()]],
  };
};

/**
 * Событие поломки змеи
 */
export const handleCrashed = (snake: Snake): Snake => {
  return {
    ...snake,
    isCrash: true,
    body: [],
    path: [],
    processed: [],
  };
};

/**
 * Смена позиции змеи
 */
export const handleSetPosition = (snake: Snake, position: number): Snake => {
  return {
    ...snake,
    body: [...snake.body.slice(1), [position, randomId()]],
  };
};

/**
 * Получение головы - возвращая тело без головы
 */
export const excludeSnakeHead = ([snake, tail]:
  | [Snake]
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0], Snake["body"][0] | undefined]):
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0] | undefined, Snake["body"][0] | undefined] => {
  const head = shakeHead(snake);

  if (!head[0]) {
    return [snake, undefined, undefined];
  }

  return [
    { ...snake, body: snake.body.slice(0, snake.body.length - 1) },
    head,
    tail,
  ];
};

/**
 * Получение хвоста - возвращая тело без хвоста
 */
export const excludeSnakeTail = ([snake, head]:
  | [Snake]
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0], Snake["body"][0] | undefined]):
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0], Snake["body"][0] | undefined] => {
  const tail = snake.body[0];

  return [{ ...snake, body: snake.body.slice(1) }, tail, head];
};

/**
 * Генерация цвета змеи
 */
export function getColorsForSnake(ai = true) {
  const color = Color(
    ai ? colorsStub[random(0, colorsStub.length - 1)] : "#2317d9"
  );

  return {
    head: color.toString(),
    crashed: color.alpha(0.3).toString(),
    body: color.alpha(0.6).toString(),
    processed: color.alpha(0.1).toString(),
  };
}

/**
 * Генерация цвета туннеля (обводка при прближении)
 */
export const getFunnelColor = (index: number) => {
  return Color.rgb({
    r: 29,
    g: 196 + index * 180,
    b: 69 + index * 180,
  }).fade(0.5);
};
