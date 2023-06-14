import { CONSTANTS } from "../../constants";
import {
  Graph,
  geIndexByPosition,
  getPositionByIndex,
  chebyshevDistance,
} from "../../graph";
import { DIRECTIONS } from "../../types";
import { AlgoritmType, Food, Snake } from "../type";
import { checkBounds, getNextPositionByDirection, shakeHead } from "../utils";

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

export const aiPositionControl = (
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
          chebyshevDistance(a[0], currentPosition) -
          chebyshevDistance(b[0], currentPosition)
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
