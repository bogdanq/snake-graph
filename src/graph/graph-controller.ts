import { CONSTANTS } from "../constants";
import { GraphType, Vertex } from "./type";

/**
 * Получение координат вершин относительно страницы
 * @param graph - созданный граф
 * @param cellCount - количество вершин
 * @param horizontalCellCount - горизонтальное количество вершин
 * @param verticalCellCount - вертикальное количество вершин
 */
export class Graph {
  public graph: GraphType;
  public cellCount: number;
  public horizontalCellCount: number;
  public verticalCellCount: number;

  constructor() {
    this.graph = {};

    this.cellCount = 0;
    this.horizontalCellCount = 0;
    this.verticalCellCount = 0;
  }

  extend(graph: Graph) {
    this.graph = graph.graph;

    return this;
  }

  createGraph() {
    this.clear();

    this.cellCount = CONSTANTS.getCellCount();
    this.horizontalCellCount = CONSTANTS.getHorizontalCellCount();
    this.verticalCellCount = CONSTANTS.getVerticalCellCount();

    for (let index = 0; index < this.cellCount; index++) {
      this.graph[index] = {
        id: "0",
        type: "EMPTY",
        siblings: this.getSiblings(index),
      };
    }

    console.log("this", this);

    return this;
  }

  getVertexByIndex(index: number) {
    return this.graph[index];
  }

  // TODO сделать type
  setValueByIndex(index: number, value: Vertex) {
    if (this.graph[index]) {
      this.graph[index] = {
        ...this.graph[index],
        ...value,
      };
    }
  }

  getSiblings(index: number) {
    const left = this.getLeftSibling(index);
    const top = this.getTopSibling(index);
    const right = this.getRightSibling(index);
    const down = this.getBottomSibling(index);

    return [top, left, down, right].filter(Boolean) as number[];
  }

  getTopSibling(index: number) {
    const hasTopNeighbour = index - this.horizontalCellCount >= 0;

    if (hasTopNeighbour) {
      return index - this.horizontalCellCount;
    }

    // return this.cellCount - this.horizontalCellCount + index;
  }

  getBottomSibling(index: number) {
    const hasDownNeighbour = index + this.horizontalCellCount < this.cellCount;

    if (hasDownNeighbour) {
      return index + this.horizontalCellCount;
    }

    // return this.horizontalCellCount - (this.cellCount - index);
  }

  getRightSibling(index: number) {
    const hasRightNeighbour =
      index % this.horizontalCellCount < this.horizontalCellCount - 1;

    if (hasRightNeighbour) {
      return index + 1;
    }

    // return index - this.horizontalCellCount + 1;
  }

  getLeftSibling(index: number) {
    const hasLeftNeighbour = index % this.horizontalCellCount > 0;

    if (hasLeftNeighbour) {
      return index - 1;
    }

    // return index + this.horizontalCellCount - 1;
  }

  clear() {
    this.graph = { ...this.graph };

    return this;
  }
}

export const graphController = new Graph();
