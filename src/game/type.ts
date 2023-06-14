import { Store } from "effector";
import { Coords, DIRECTIONS } from "../types";
import { controll } from "./game-controll";
import type { Graph } from "../graph";

export type AlgoritmType = (
  startIndex: number,
  endIndex: number,
  graph: Graph
) => { path: number[]; processed: number[] };

export type Food = [Coords, { id: string; type: "DEFAULT" | "SNAKE" }];

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
  gameStatus: GameStatus;
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
  ) => ReturnType<typeof controll.user> & ReturnType<AlgoritmType>;

  isCrash: boolean;
  id: string;
  colors: SnakeColors;
  isAi: boolean;
};

export type ComputedSnake = {
  snake: Snake;
  algorithm?: AlgoritmType;
};

export type GameStatus = "PENDING" | "RUNING" | "FINISHED";
