import { VertexType } from "../type";

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
