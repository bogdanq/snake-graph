import { Coords } from "../types";

// https://tproger.ru/translations/3-basic-distances-in-data-science/ геометрию пространства

/**
 * Получить расстояние от точки p => p1
 * по теореме L1F
 * находит кратчайшее расстоняние по блокам
 * (количество прямых линий в пути, каждый квадрат считается как 2 хода)
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function manhattanDistance(p: Coords, p1: Coords): number {
  return Math.abs(p[0] - p1[0]) + Math.abs(p[1] - p1[1]);
}

/**
 * Получить расстояние от точки p => p1
 * по теореме Пифагора
 * находит кратчайшее расстоняние по диагонали
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function pifagoreDistance(p: Coords, p1: Coords): number {
  return Math.sqrt(Math.pow(p[0] - p1[0], 2) + Math.pow(p[1] - p1[1], 2));
}

/**
 * Получить расстояние от точки p => p1
 * по теореме Chebyshev
 * находит кратчайшее расстоняние по блокам (включая диагональ)
 * (количество ходов до цели каждый квадрат считается как 1 ход)
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function chebyshevDistance(p: Coords, p1: Coords): number {
  return Math.max(Math.abs(p[0] - p1[0]), Math.abs(p[1] - p1[1]));
}
