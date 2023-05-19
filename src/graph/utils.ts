import { CONSTANTS } from "../constants";
import { Coords } from "../types";
import { VertexType } from "./type";

/**
 * Получение координат вершин относительно страницы
 * @param {number} x - позиция по оси X (mouseEvent.clientX)
 * @param {number} y - позиция по оси Y (mouseEvent.clientY)
 */
export function getLocalSize(x: number, y: number) {
  return {
    x: Math.floor(x / CONSTANTS.CELL_SIZE),
    y: Math.floor(y / CONSTANTS.CELL_SIZE),
  };
}

/**
 * Получение координаты вершины относительно страницы
 * @param {number} index - порядковый номер вершины графа
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
 * Получение порядкового номера вершины относительно ее позиции координаты
 * @param {number} x - позиция по оси х
 * @param {number} y - позиция по оси y
 */
export function geIndexByPosition([x, y]: Coords) {
  const count = CONSTANTS.getHorizontalCellCount();

  return y * count + x;
}

/**
 * Получение координат по осям относительно окна
 * @param {number} index - порядковый номер вершины графа
 */
export function getGlobalPositionByIndex(index: number | null) {
  if (!index) {
    return [0, 0];
  }

  const [x, y] = getPositionByIndex(index);

  return [x * CONSTANTS.CELL_SIZE, y * CONSTANTS.CELL_SIZE];
}

/**
 * Получение координат по осям относительно окна
 * @param {number} x - позиция по оси х
 * @param {number} y - позиция по оси y
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
  const { x, y } = getLocalSize(e.clientX, e.clientY);

  return geIndexByPosition([x, y]);
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

/**
 * функция для проверки возможности посещения вершины графа
 */
export const canVisitedVertex = (vertex: { type: VertexType }) => {
  if (vertex.type !== "SNAKE") {
    return true;
  }

  return false;
};

/**
 * функция возвращает путь по обьекту истории
 * в обьект записывается вершина текущая и вершина из которой в нее зашли
 *
 * {current: parent}
 */
export function restorePath(
  endIndex: number,
  startIndex: number,
  historyPath: { [key: string]: number }
) {
  const path = [endIndex];
  let lastStep = endIndex;

  while (lastStep && lastStep !== startIndex) {
    path.unshift(historyPath[lastStep]);
    lastStep = historyPath[lastStep];
  }

  return path.filter((i) => i !== startIndex);
}
