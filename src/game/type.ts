import { Store } from "effector";
import { Coords, DIRECTIONS } from "../types";
import { keyboardControl } from "./controll";
import { Graph } from "../graph";

export type Food = [Coords, string];

export type SnakeColors = {
  head: string;
  crashed: string;
  processed: string;
  tail: string;
};

export type Snake = {
  direction: DIRECTIONS;
  body: [number, string][];
  path?: number[];
  updater: (snake: Snake) => ReturnType<typeof keyboardControl>;
  isCrash: boolean;
  id: string;
  colors: SnakeColors;
  isAi: boolean;
};

export type Funnel = [number, number];

export type LoopStore = Store<{
  snakes: Snake[];
  food: Food[];
  graph: Graph;
  funnel: Funnel[];
}>;
