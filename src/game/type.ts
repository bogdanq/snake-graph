import { Store } from "effector";
import { Coords, DIRECTIONS } from "../types";
import { keyboardControl } from "./controll";
import { Graph, GraphType } from "../graph";

export type AlgoritmType = (
  startIndex: number,
  endIndex: number,
  graph: GraphType
) => number[];

export type Food = [Coords, string];

export type SnakeColors = {
  head: string;
  crashed: string;
  processed: string;
  tail: string;
};

export type Funnel = [number, number];

export type LoopStore = Store<{
  snakes: ComputedSnake[];
  food: Food[];
  graph: Graph;
  funnel: Funnel[];
}>;

export type Snake = {
  direction: DIRECTIONS;
  body: [number, string][];
  path?: number[];
  updater: (
    snake: Snake,
    foods: Food[],
    graph: GraphType,
    algorithm?: AlgoritmType
  ) => ReturnType<typeof keyboardControl> & { path?: number[] };
  isCrash: boolean;
  id: string;
  colors: SnakeColors;
  isAi: boolean;
};

export type ComputedSnake = {
  snake: Snake;
  algorithm?: AlgoritmType;
};
