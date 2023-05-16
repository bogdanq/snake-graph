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
import { keyboardControl } from "../controll";
import {
  Graph,
  geIndexByPosition,
  graphController,
  randomId,
} from "../../graph";
import { getColorsForSnake } from "../../snake-helpers";
import {
  generateRandomFoodByCount,
  generateRandomFunnelByCount,
} from "../../render";
import { Food, Funnel, Snake } from "../type";

export const $fps = createStore(CONSTANTS.FPS);

export const updateSnake = createEvent<Snake[]>();

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
  // {
  //   direction: DIRECTIONS.DOWN,
  //   body: Array.from({ length: 10 }).map((_, i) => [i + 30, randomId()]),
  //   // path: [2, 13, 24, 35, 46, 47, 48, 49, 38, 27, 16, 15], // to left
  //   // path: [2, 13, 24, 35, 46, 47, 48, 49, 38, 27], // to top
  //   path: [31], // to bott
  //   // path: [2, 89, 78, 67, 68], // to right
  //   updater: (snake: Snake) => {
  //     return getAISnakePosition(snake);
  //   },
  //   isCrash: false,
  //   id: randomId(),
  //   colors: getColorsForSnake(),
  //   isAi: true
  // }
]).on(
  updateSnake,
  // TODO игроков удалять, ботов оставлять мертвыми
  // (state, snakes) => snakes
  (state, snakes) =>
    state.map((s) => {
      const nextSnake = snakes.find((snake) => snake.id === s.id);

      return nextSnake ? nextSnake : s;
    })
);

export const updateFood = createEvent<Food[]>();

export const $food = createStore<Food[]>(
  generateRandomFoodByCount(CONSTANTS.START_FOOD_COUNT)
).on(updateFood, (prev, next) => {
  return next;
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

    entities.snakes.forEach((snake) => {
      graph.updateVertex(
        snake.body.map(([index]) => {
          return {
            type: "SNAKE",
            value: snake.id,
            index,
          };
        })
      );
    });

    graph.updateVertex(
      entities.food.map(([position, id]) => {
        return {
          type: "FOOD",
          value: id,
          index: geIndexByPosition(position),
        };
      })
    );

    graph.updateVertex(
      entities.funnel.map((funnel) => ({
        type: "FUNNEL",
        value: "funnel-id",
        index: funnel,
      }))
    );

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
