import random from "lodash-es/random";
import { CONSTANTS } from "../constants";
import { Food, Funnel } from "../game";
import { randomId, randomPosition } from "../graph/utils";

/**
 * Генерация рандомного ID
 */
export function generateRandomFoodByCount(count: number): Array<Food> {
  const foods: Array<Food> = [];

  for (let i = 0; i < count; i++) {
    foods.push([randomPosition(), { id: randomId(), type: "DEFAULT" }]);
  }

  return foods;
}

/**
 * Генерация рандомных порталов
 */
export function generateRandomFunnelByCount(count: number): Array<Funnel> {
  const foods: Array<Funnel> = [];

  const w = CONSTANTS.getHorizontalCellCount();
  const h = CONSTANTS.getVerticalCellCount();

  for (let i = 0; i < count; i++) {
    foods.push([random(0, w * h), random(0, random(w, h * w))]);
  }

  return foods;
}
