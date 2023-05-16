import Color from "color";
import random from "lodash-es/random";
import { Snake } from "./game";
import { DIRECTIONS } from "./types";
import { randomId } from "./graph";

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

export const shakeHead = (snake: Snake): [number, string] | [null] => {
  if (!snake) return [null];

  return snake.body[snake.body.length - 1] || [];
};

export const shakeTail = (snake: Snake) => {
  return snake.body[0];
};

export const handleSetDirection = (
  snake: Snake,
  direction: DIRECTIONS
): Snake => {
  return { ...snake, direction };
};

export const handleEatFood = (snake: Snake, foodId: number): Snake => {
  return {
    ...snake,
    body: [...snake.body, [foodId, randomId()]],
  };
};

export const handleCrashed = (snake: Snake): Snake => {
  return {
    ...snake,
    isCrash: true,
    body: [],
  };
};

export const handleSetPosition = (snake: Snake, position: number): Snake => {
  return {
    ...snake,
    body: [...snake.body.slice(1), [position, randomId()]],
  };
};

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

export const excludeSnakeTail = ([snake, head]:
  | [Snake]
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0], Snake["body"][0] | undefined]):
  | [Snake, Snake["body"][0]]
  | [Snake, Snake["body"][0], Snake["body"][0] | undefined] => {
  const tail = snake.body[0];

  return [{ ...snake, body: snake.body.slice(1) }, tail, head];
};

export function getColorsForSnake(ai = true) {
  const color = Color(colorsStub[ai ? random(0, colorsStub.length - 1) : 1]);

  return {
    head: color.toString(),
    crashed: color.alpha(0.3).toString(),
    processed: color.alpha(0.6).toString(),
    tail: color.alpha(0.5).toString(),
  };
}

export const getFunnelColor = (index: number) => {
  return Color.rgb({
    r: 29,
    g: 196 + index * 180,
    b: 69 + index * 180,
  }).fade(0.5);
};
