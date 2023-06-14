import { CONSTANTS } from "../constants";
import { Coords } from "../types";

/**
 * Получение координат вершин графа
 * 0 1 2 3 4
 * 5 6 7 8 9
 * getLocalSize(1, 1) => [0 , 0]
 * [0 , 0] - координата вершины 0
 * @param x - позиция по оси X (mouseEvent.clientX)
 * @param y - позиция по оси Y (mouseEvent.clientY)
 */
export function getLocalSize(x: number, y: number): Coords {
  return [
    Math.floor(x / CONSTANTS.CELL_SIZE),
    Math.floor(y / CONSTANTS.CELL_SIZE),
  ];
}

/**
 * Получение координат вершин графа по индексу вершины
 * 0 1 2 3 4
 * 5 6 7 8 9
 * getPositionByIndex(1) => [1 , 0]
 * [1 , 0] - координата вершины 1
 * @param index - порядковый номер вершины графа
 */
export function getPositionByIndex(index: number | null): Coords {
  if (index === undefined || index === null) {
    return [0, 0];
  }

  const count = CONSTANTS.getHorizontalCellCount();

  const y = Math.floor(index / count);
  const x = index - y * count;

  return [x, y];
}

/**
 * Получение порядкового номера вершины относительно ее координат
 * 0 1 2 3 4
 * 5 6 7 8 9
 * geIndexByPosition([1, 0]) => 1
 * @param x - позиция по оси х
 * @param y - позиция по оси y
 */
export function geIndexByPosition([x, y]: Coords) {
  const count = CONSTANTS.getHorizontalCellCount();

  return y * count + x;
}

/**
 * Получение координат вершины относительно страницы
 * 0 1 2 3 4
 * 5 6 7 8 9
 * getGlobalPositionByIndex(1) => [25, 0]
 * [25, 0] - координата вершины 1
 * @param index - порядковый номер вершины графа
 */
export function getGlobalPositionByIndex(index: number | null): Coords {
  if (index === undefined) {
    return [0, 0];
  }

  const [x, y] = getPositionByIndex(index);

  return [x * CONSTANTS.CELL_SIZE, y * CONSTANTS.CELL_SIZE];
}

/**
 * Получение координат вершины относительно страницы
 * 0 1 2 3 4
 * 5 6 7 8 9
 * getGlobalPositionByCoord([1, 0]) => [25, 0]
 * [25, 0] - координата вершины 1
 * @param x - позиция вершины по оси х
 * @param y - позиция вершины по оси y
 */
export function getGlobalPositionByCoord([x, y]: Coords) {
  return [x * CONSTANTS.CELL_SIZE, y * CONSTANTS.CELL_SIZE];
}

/**
 * Получение порядкового номера вершины относительно ее позиции
 * с помощью ивента
 * @param {number} e - MouseEvent
 */
export function getTargetIndex(e: MouseEvent) {
  return geIndexByPosition(getLocalSize(e.clientX, e.clientY));
}

/**
 * Получение рандомной позиции на графе по осям
 */
export function randomPosition(): Coords {
  const w = CONSTANTS.getHorizontalCellCount();
  const h = CONSTANTS.getVerticalCellCount();

  function intNumber(n: number): number {
    return Math.floor(Math.random() * n);
  }

  return [intNumber(w), intNumber(h)];
}

/**
 * Генерация рандомного ID
 */
export function randomId(): string {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
}
