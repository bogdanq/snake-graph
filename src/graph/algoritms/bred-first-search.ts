import type { Graph } from "../graph-controller";
import { canVisitedVertex, restorePath } from "./utils";

export function breadthFirstSearch(
  startIndex: number,
  endIndex: number,
  graph: Graph
): { path: number[]; processed: number[] } {
  let isWork = true;

  const queue = [startIndex];
  const visited = new Map([[startIndex, true]]);
  const path: { [key: string]: number } = {};

  while (isWork && queue.length > 0) {
    const currentIndex = queue.shift();

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

      if (vertex && !visited.has(sibling) && canVisitedVertex(vertex)) {
        queue.push(sibling);
        visited.set(sibling, true);
        path[sibling] = currentIndex;
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
