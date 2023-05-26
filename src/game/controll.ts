import { CONSTANTS } from "../constants";
import { eventControl } from "../controll";
import { Graph, geIndexByPosition, getPositionByIndex } from "../graph";
import { DIRECTIONS, KEYS } from "../types";
import { AlgoritmType, Food, Snake } from "./type";
import { checkBounds, getNextPositionByDirection, shakeHead } from "./utils";
import {
  pifagoreDistance,
  chebyshevDistance,
  manhattanDistance,
} from "./heuristic";

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

export const getAISnakePosition = (
  snake: Snake,
  foods: Food[],
  graph: Graph,
  algorithm?: AlgoritmType
) => {
  let { direction } = snake;

  let path: Array<number> = [];
  let processed: Array<number> = [];

  const head = shakeHead(snake);
  const currentPosition = getPositionByIndex(head[0]);

  const nearestFood =
    foods
      .filter(
        ([position]) =>
          graph.getVertexByIndex(geIndexByPosition(position)).type === "FOOD"
      )
      .sort(
        (a, b) =>
          chebyshevDistance({ p1: a[0], p: currentPosition }) -
          chebyshevDistance({ p1: b[0], p: currentPosition })
      )[0] || foods[0];

  // @ts-ignore
  const targetIndex = geIndexByPosition(nearestFood[0]);

  if (algorithm && targetIndex !== undefined) {
    const res = algorithm(head[0], targetIndex, graph);

    path = res.path;
    processed = res.processed;
  }

  let nextPosition = 0;

  if (path[0]) {
    nextPosition = path[0];
  } else {
    nextPosition = geIndexByPosition(
      checkBounds(getNextPositionByDirection(snake, direction))
    );
  }
  // @ts-ignore
  const nextDir = getDirectionByPosition(head[0], nextPosition);

  return {
    nextPosition,
    nextDirection: path?.length ? nextDir! : direction,
    path,
    processed,
  };
};
