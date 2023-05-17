import { graphController } from "../graph-controller";
import { GraphType } from "../type";
import { canVisitedVertex, restorePath } from "../utils";

export function breadthFirstSearch(
  startIndex: number,
  endIndex: number,
  graph: GraphType
): number[] {
  let isWork = true;

  const queue = [startIndex];
  const visited = [startIndex];
  const path: { [key: string]: number } = {};

  while (isWork && queue.length > 0) {
    const currentIndex = queue.shift();

    if (currentIndex === undefined) {
      isWork = false;
      break;
    }

    for (let i = 0; i < graph[currentIndex].siblings.length; i++) {
      const sibling = graph[currentIndex].siblings[i];

      if (!sibling) {
        isWork = false;
        break;
      }

      const vertex = graphController.getVertexByIndex(sibling);

      if (vertex && !visited.includes(sibling) && canVisitedVertex(vertex)) {
        queue.push(sibling);
        visited.push(sibling);
        path[sibling] = currentIndex;
      }

      if (sibling === endIndex) {
        isWork = false;
        break;
      }
    }
  }

  return restorePath(endIndex, startIndex, path);
}
