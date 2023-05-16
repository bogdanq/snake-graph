import { CONSTANTS } from "../constants";
import { eventControl } from "../controll";
import { geIndexByPosition } from "../graph";
import { shakeHead } from "../snake-helpers";
import { DIRECTIONS, KEYS } from "../types";
import { Snake } from "./type";
import { checkBounds, getNextPositionByDirection } from "./utils";

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
};

export const getAISnakePosition = (snake: Snake) => {
  let { direction, path } = snake;

  const head = shakeHead(snake);

  // удалить старый путь
  path?.shift();

  const nextPosition = path?.length
    ? path?.[path?.findIndex((p) => p === head[0]) + 1]
    : geIndexByPosition(
        checkBounds(getNextPositionByDirection(snake, direction))
      );
  // @ts-ignore
  const nextDir = getDirectionByPosition(head[0], nextPosition);

  return {
    nextPosition,
    nextDirection: path?.length ? nextDir! : direction,
  };
};
