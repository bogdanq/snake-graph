import random from "lodash-es/random";
import { CONSTANTS } from "../constants";
import { eventControl } from "../controll";
import { GraphType, geIndexByPosition } from "../graph";
import { DIRECTIONS, KEYS } from "../types";
import { AlgoritmType, Food, Snake } from "./type";
import { checkBounds, getNextPositionByDirection, shakeHead } from "./utils";

export function keyboradFactory(): {
  checkDirection: (arg0: number[]) => boolean;
} {
  let pressedKeys: { [key: string]: boolean } = {
    [DIRECTIONS.RIGHT]: true,
  };

  eventControl.addKeydownEvent((event) => {
    pressedKeys = {};

    if (Object.values(KEYS).flat().includes(event.keyCode)) {
      pressedKeys[event.keyCode] = true;
    }
  });

  return {
    checkDirection: (keyCode: number[]) => {
      return keyCode.some((code) => !!pressedKeys[code]);
    },
  };
}

const gameInput = keyboradFactory();

export const keyboardControl = (
  snake: Snake
): {
  nextPosition: number;
  nextDirection: DIRECTIONS;
} => {
  let { direction } = snake;

  if (
    gameInput.checkDirection([KEYS.RIGHT_ARROW, KEYS.RIGHT_ARROW_PAD]) &&
    snake.direction !== DIRECTIONS.LEFT
  ) {
    direction = DIRECTIONS.RIGHT;
  }

  if (
    gameInput.checkDirection([KEYS.DOWN_ARROW, KEYS.DOWN_ARROW_PAD]) &&
    snake.direction !== DIRECTIONS.TOP
  ) {
    direction = DIRECTIONS.DOWN;
  }

  if (
    gameInput.checkDirection([KEYS.LEFT_ARROW, KEYS.LEFT_ARROW_PAD]) &&
    snake.direction !== DIRECTIONS.RIGHT
  ) {
    direction = DIRECTIONS.LEFT;
  }

  if (
    gameInput.checkDirection([KEYS.TOP_ARROW, KEYS.TOP_ARROW_PAD]) &&
    snake.direction !== DIRECTIONS.DOWN
  ) {
    direction = DIRECTIONS.TOP;
  }

  return {
    nextPosition: geIndexByPosition(
      checkBounds(getNextPositionByDirection(snake, direction))
    ),
    nextDirection: direction,
  };
};

// ai helpers

const getDirectionByPosition = (position: number, nextPosition: number) => {
  const horizontalCount = CONSTANTS.getHorizontalCellCount();

  if (nextPosition === position + 1) {
    return DIRECTIONS.RIGHT;
  }

  if (nextPosition === position - 1) {
    return DIRECTIONS.LEFT;
  }

  if (nextPosition === position - horizontalCount) {
    return DIRECTIONS.TOP;
  }

  if (nextPosition === position + horizontalCount) {
    return DIRECTIONS.DOWN;
  }

  return DIRECTIONS.RIGHT;
};

let targetIndex = 0;
export const getAISnakePosition = (
  snake: Snake,
  foods: Food[],
  graph: GraphType,
  algorithm?: AlgoritmType
) => {
  let { direction } = snake;

  let path: Array<number> = [];

  if (graph[targetIndex].type !== "FOOD") {
    targetIndex = 0;
  }

  if (!targetIndex) {
    // TODO рандом переделать на евристику
    targetIndex = geIndexByPosition(foods[random(0, foods.length)][0]);
  }

  const head = shakeHead(snake);

  if (algorithm && head[0] && !!targetIndex) {
    // console.time("s");
    path = algorithm(head[0], targetIndex, graph);
    // console.timeEnd("s");
  }

  // удалить старый путь
  path?.shift();

  const nextPosition = path?.length
    ? path[0]
    : geIndexByPosition(
        checkBounds(getNextPositionByDirection(snake, direction))
      );
  // @ts-ignore
  const nextDir = getDirectionByPosition(head[0], nextPosition);

  return {
    nextPosition,
    nextDirection: path?.length ? nextDir! : direction,
    path,
  };
};
