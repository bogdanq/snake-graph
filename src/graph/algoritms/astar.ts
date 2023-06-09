import PriorityQueue from "fastpriorityqueue";
import {
  pifagoreDistance,
  manhattanDistance,
  chebyshevDistance,
} from "../../game/heuristic";

import { Graph } from "../graph-controller";
import { canVisitedVertex, getPositionByIndex, restorePath } from "../utils";

export function astar(
  startIndex: number,
  endIndex: number,
  graph: Graph
): { path: number[]; processed: number[] } {
  let isWork = true;
  const endPosition = getPositionByIndex(endIndex);

  const priorityQueue = new PriorityQueue<[number, number]>(
    (a, b) => a[1] < b[1]
  );
  const visited = new Map([[startIndex, 0]]);
  const path: { [key: string]: number } = {};

  priorityQueue.add([startIndex, 0]);

  while (isWork && !priorityQueue.isEmpty()) {
    const [currentIndex] = priorityQueue.poll() || [];

    if (currentIndex === undefined) {
      isWork = false;
      break;
    }

    for (let i = 0; i < graph.graph[currentIndex].siblings.length; i++) {
      const sibling = graph.graph[currentIndex].siblings[i];

      if (!sibling) {
        isWork = false;
        break;
      }

      const vertex = graph.getVertexByIndex(sibling);

      if (vertex && canVisitedVertex(vertex)) {
        const nextWeight = (visited.get(currentIndex) || currentIndex) + 1;

        const weightIsLower =
          typeof visited.get(sibling) === "undefined" ||
          nextWeight < (visited.get(sibling) || Infinity);

        if (weightIsLower || !visited.has(sibling)) {
          priorityQueue.add([
            sibling,
            nextWeight +
              pifagoreDistance(getPositionByIndex(sibling), endPosition),
          ]);

          visited.set(sibling, nextWeight);
          path[sibling] = currentIndex;
        }
      }

      if (sibling === endIndex) {
        isWork = false;
        break;
      }
    }
  }

  return {
    path: restorePath(endIndex, startIndex, path),
    // @ts-ignore
    processed: [...visited.keys()],
  };
}
