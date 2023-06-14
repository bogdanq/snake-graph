import {
  createStore,
  createEvent,
  combine,
  sample,
  attach,
  StoreValue,
  Effect,
  merge,
} from "effector";
import { CONSTANTS } from "../../constants";
import { DIRECTIONS } from "../../types";
import {
  Graph,
  breadthFirstSearch,
  geIndexByPosition,
  graphController,
  randomId,
  randomPosition,
  depthFirstSearch,
  astar,
} from "../../graph";
import {
  generateRandomFoodByCount,
  generateRandomFunnelByCount,
} from "../../render";
import { ComputedSnake, Food, Funnel, GameStatus, Snake } from "../type";
import { getColorsForSnake } from "../utils";
import {
  markFoodOnGraph,
  markFunnelOnGraph,
  markSnakeOnGraph,
} from "../../graph/update-graph";
import { controll } from "../game-controll";

export const $fps = createStore(CONSTANTS.FPS);

export const updateStores = createEvent<{ snakes: Snake[]; foods: Food[] }>();

export const startGame = createEvent();
export const pauseGame = createEvent();
export const restartGame = createEvent();

export const $algoritms = createStore<
  Array<{
    id: string;
    alg: typeof breadthFirstSearch;
    name: string;
  }>
>([
  {
    id: "breadth",
    alg: depthFirstSearch,
    name: "Breadth first search",
  },
  {
    id: "depth",
    alg: depthFirstSearch,
    name: "Depth first search",
  },
]);
//@ts-ignore
export const $snakes = createStore<Snake[]>([
  {
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: CONSTANTS.SNAKE_LENGT }).map((_, i) => [
      geIndexByPosition(randomPosition()),
      randomId(),
    ]),
    updater: (snake: Snake) => {
      return controll.user(snake);
    },
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(false),
    isAi: false,
  },
  ...(Array.from<Snake[]>({ length: CONSTANTS.BOT_START_COUNT }).map((_) => ({
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: 4 }).map((_, i) => [
      geIndexByPosition(randomPosition()),
      randomId(),
    ]),
    updater: controll.ai,
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(),
    isAi: true,
  })) as any),
])
  .on(updateStores, (_, nextState) => nextState.snakes)
  .reset(restartGame);

export const $computedSnakes = $snakes.map<ComputedSnake[]>((snakes) => {
  return snakes.map((snake) => {
    if (snake.isAi) {
      return { snake, algorithm: astar };
    }

    return { snake };
  });
});

export const $food = createStore<Food[]>(
  generateRandomFoodByCount(CONSTANTS.START_FOOD_COUNT)
)
  .on(updateStores, (prev, { foods }) => {
    return foods;
  })
  .reset(restartGame);

$food.watch(console.log);

export const $currentSnake = $snakes.map(
  (snakes) => snakes.find((snake) => !snake.isAi) as Snake
);

export const $funnel = createStore<Funnel[]>(
  generateRandomFunnelByCount(CONSTANTS.FUNNEL_LENGT)
);

export const $graph = createStore(graphController.createGraph()).reset(
  restartGame
);

const $entities = combine({
  food: $food,
  snakes: $snakes,
  funnel: $funnel,
});

export const $gameStatus = createStore<GameStatus>("PENDING")
  .on(merge([startGame, restartGame]), () => "RUNING")
  .on(pauseGame, () => "PENDING");

type Entities = StoreValue<typeof $entities>;

const updateGraphFx: Effect<Entities, Graph> = attach({
  source: $graph,
  effect: (gr, entities: Entities) => {
    const graph = graphController.extend(gr);

    markFoodOnGraph(entities.food);
    markFunnelOnGraph(entities.funnel);
    markSnakeOnGraph(entities.snakes);

    return graph;
  },
});

sample({
  clock: $entities,
  target: updateGraphFx,
});

$graph.on(updateGraphFx.doneData, (_, next) => {
  return next;
});
