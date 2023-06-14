import { eventControl } from "../../controll";
import { geIndexByPosition } from "../../graph";
import { DIRECTIONS, KEYS } from "../../types";
import { Snake } from "../type";
import { checkBounds, getNextPositionByDirection } from "../utils";

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
