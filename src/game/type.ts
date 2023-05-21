import { Store } from "effector";
import { Coords, DIRECTIONS } from "../types";
import { keyboardControl } from "./controll";
import { Graph } from "../graph";

export type AlgoritmType = (
  startIndex: number,
  endIndex: number,
  graph: Graph
) => { path: number[]; processed: number[] };

export type Food = [Coords, string];

export type SnakeColors = {
  head: string;
  crashed: string;
  processed: string;
  body: string;
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
  processed?: number[];

  updater: (
    snake: Snake,
    foods: Food[],
    graph: Graph,
    algorithm?: AlgoritmType
  ) => ReturnType<typeof keyboardControl> & ReturnType<AlgoritmType>;

  isCrash: boolean;
  id: string;
  colors: SnakeColors;
  isAi: boolean;
};

export type ComputedSnake = {
  snake: Snake;
  algorithm?: AlgoritmType;
};

export type HeuristicProps = { p1: Coords; p: Coords };
export type HeuristicResul = number;
