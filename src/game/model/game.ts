import {
  createStore,
  createEvent,
  combine,
  sample,
  attach,
  StoreValue,
  Effect,
} from "effector";
import { CONSTANTS } from "../../constants";
import {
  Graph,
  breadthFirstSearch,
  graphController,
  depthFirstSearch,
  astar,
} from "../../graph";
import {
  generateRandomFoodByCount,
  generateRandomFunnelByCount,
} from "../../render";
import { ComputedSnake, Food, Funnel, GameStatus, Snake } from "../type";
import { buildSnakes } from "../utils";
import {
  markFoodOnGraph,
  markFunnelOnGraph,
  markSnakeOnGraph,
} from "../../graph/update-graph";

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
  ...buildSnakes(),
  ...buildSnakes(CONSTANTS.BOT_START_COUNT, true),
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
  .on(restartGame, () => generateRandomFoodByCount(CONSTANTS.START_FOOD_COUNT));

export const $currentSnake = $snakes.map(
  (snakes) => snakes.find((snake) => !snake.isAi) as Snake
);

export const $funnel = createStore<Funnel[]>(
  generateRandomFunnelByCount(CONSTANTS.FUNNEL_LENGT)
).on(restartGame, () => generateRandomFunnelByCount(CONSTANTS.FUNNEL_LENGT));

export const $graph = createStore(graphController.createGraph()).on(
  restartGame,
  () => graphController.createGraph()
);

const $entities = combine({
  food: $food,
  snakes: $snakes,
  funnel: $funnel,
});

export const $gameStatus = createStore<GameStatus>("PENDING")
  .on(startGame, () => "RUNING")
  .on(restartGame, () => "PENDING")
  .on(pauseGame, () => "PENDING");

type Entities = StoreValue<typeof $entities>;

const updateGraphFx: Effect<Entities, Graph> = attach({
  source: $graph,
  effect: (gr, entities: Entities) => {
    gr.clear();

    markFoodOnGraph(entities.food);
    markFunnelOnGraph(entities.funnel);
    markSnakeOnGraph(entities.snakes);

    const graph = graphController.extend(gr);

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
