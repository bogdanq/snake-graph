import { HeuristicProps, HeuristicResul } from "./type";

// https://tproger.ru/translations/3-basic-distances-in-data-science/ геометрию пространства

/**
 * Получить расстояние от точки p => p1
 * по теореме L1
 * находит кратчайшее расстоняние по блокам
 * (количество прямых линий в пути, каждый квадрат считается как 2 хода)
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function manhattanDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): HeuristicResul {
  return Math.abs(x - x1) + Math.abs(y - y1);
}

/**
 * Получить расстояние от точки p => p1
 * по теореме Пифагора
 * находит кратчайшее расстоняние по диагонали
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function pifagoreDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): HeuristicResul {
  return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
}

/**
 * Получить расстояние от точки p => p1
 * по теореме Chebyshev
 * находит кратчайшее расстоняние по блокам (включая диагональ)
 * (количество ходов до цели каждый квадрат считается как 1 ход)
 * @param p - позиция головы (по координатам графа)
 * @param p1 - позиция точки еды (по координатам графа)
 */
export function chebyshevDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): HeuristicResul {
  return Math.max(Math.abs(x - x1), Math.abs(y - y1));
}
