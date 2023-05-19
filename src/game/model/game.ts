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
import { DIRECTIONS } from "../../types";
import { getAISnakePosition, keyboardControl } from "../controll";
import {
  Graph,
  breadthFirstSearch,
  graphController,
  randomId,
} from "../../graph";
import {
  generateRandomFoodByCount,
  generateRandomFunnelByCount,
} from "../../render";
import { ComputedSnake, Food, Funnel, Snake } from "../type";
import { getColorsForSnake } from "../utils";
import {
  markFoodOnGraph,
  markFunnelOnGraph,
  markSnakeOnGraph,
} from "../../graph/update-graph";

export const $fps = createStore(CONSTANTS.FPS);

export const updateStores = createEvent<{ snakes: Snake[]; foods: Food[] }>();

export const $algoritms = createStore<
  Array<{
    id: string;
    alg: typeof breadthFirstSearch;
    name: string;
  }>
>([
  {
    id: "breadth",
    alg: breadthFirstSearch,
    name: "Breadth first search",
  },
]);
//@ts-ignore
export const $snakes = createStore<Snake[]>([
  {
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: CONSTANTS.SNAKE_LENGT }).map((_, i) => [
      i + 1000,
      randomId(),
    ]),
    updater: (snake: Snake) => {
      return keyboardControl(snake);
    },
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(false),
    isAi: false,
  },
  ...(Array.from<Snake[]>({ length: 8 }).map((_, snakeId) => ({
    direction: DIRECTIONS.DOWN,
    body: Array.from({ length: 10 }).map((_, i) => [
      i + 10 * snakeId,
      randomId(),
    ]),
    updater: getAISnakePosition,
    isCrash: false,
    id: randomId(),
    colors: getColorsForSnake(),
    isAi: true,
  })) as any),
]).on(
  updateStores,
  // TODO игроков удалять, ботов оставлять мертвыми
  // (state, snakes) => snakes
  (state, { snakes }) =>
    state.map((s) => {
      const nextSnake = snakes.find((snake) => snake.id === s.id);

      return nextSnake ? nextSnake : s;
    })
);

export const $computedSnakes = $snakes.map<ComputedSnake[]>((snakes) => {
  return snakes.map((snake) => {
    if (snake.isAi) {
      return { snake, algorithm: breadthFirstSearch };
    }

    return { snake };
  });
});

export const $food = createStore<Food[]>(
  generateRandomFoodByCount(CONSTANTS.START_FOOD_COUNT)
).on(updateStores, (prev, { foods }) => {
  return foods;
});
export const $currentSnake = $snakes.map(
  (snakes) => snakes.find((snake) => !snake.isAi) as Snake
);

export const $funnel = createStore<Funnel[]>(
  generateRandomFunnelByCount(CONSTANTS.FUNNEL_LENGT)
);

export const $graph = createStore(graphController.createGraph());

const $entities = combine({
  food: $food,
  snakes: $snakes,
  funnel: $funnel,
});

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
