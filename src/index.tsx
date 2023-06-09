import ReactDOM from "react-dom/client";

import "./styles.css";
import { useEffect } from "react";
import { combine, StoreValue } from "effector";
import { createTick } from "./loop";
import {
  $computedSnakes,
  $food,
  $funnel,
  $graph,
  shakeTail,
  Food,
  Snake,
  shakeHead,
  updateStores,
} from "./game";
import { eventControl } from "./controll";
import {
  handleCrashed,
  handleEatFood,
  handleSetDirection,
  handleSetPosition,
} from "./game";
import { svgRender } from "./render";
import { Coords } from "./types";
import { Area, GameTemplate } from "./ui";
import {
  geIndexByPosition,
  getPositionByIndex,
  graphController,
  randomId,
  randomPosition,
} from "./graph";

import "./global.css";
import { recreateSnakeOnGraph } from "./graph/update-graph";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const $state = combine({
  snakes: $computedSnakes,
  food: $food,
  graph: $graph,
  funnel: $funnel,
});

const main = () => {
  const render = ({ state }: { state: StoreValue<typeof $state> }) => {
    svgRender.drowFood(state);
    svgRender.drowSnake(state);
    svgRender.drowFunnel(state);
  };

  createTick({
    $state,
    runLogic: (nextState) => {
      let nextSnakes: Array<Snake> = [];
      let { food } = nextState.state;

      const graph = graphController.extend(nextState.state.graph);

      const eatFood = (nextPosition: number, nextSnake: Snake) => {
        const id = randomPosition();

        food = [...food, [id, randomId()]].filter(([position]) => {
          return geIndexByPosition(position as Coords) !== nextPosition;
        }) as [Coords, string][];

        graph.setValueByIndex(nextPosition, {
          id: nextSnake.id,
          type: "SNAKE",
        });

        return handleEatFood(
          handleSetPosition(nextSnake, nextPosition),
          nextPosition
        );
      };

      nextState.state.snakes
        .filter(({ snake }) => !snake.isCrash)
        .forEach(({ snake, algorithm }) => {
          const { nextDirection, nextPosition, path, processed } =
            snake.updater(snake, nextState.state.food, graph, algorithm);

          let nextSnake = snake;

          const nextVertex = graph.getVertexByIndex(nextPosition);
          const type = nextVertex.type;

          switch (type) {
            case "FOOD":
              nextSnake = eatFood(nextPosition, nextSnake);
              break;

            case "SNAKE":
              const foods = snake.body.map(([position]) => [
                getPositionByIndex(position),
                randomId(),
              ]) as [Coords, string][];

              food.push(...foods);

              nextSnake = handleCrashed(snake);

              break;

            case "FUNNEL":
              nextSnake = handleSetPosition(
                snake,
                nextVertex.siblings?.[0] || 0
              );
              break;

            default:
              nextSnake = handleSetDirection(
                handleSetPosition(nextSnake, nextPosition),
                nextDirection
              );
              break;
          }

          recreateSnakeOnGraph(snake, nextSnake);

          if (path?.length) {
            nextSnake.path = path;
          }
          if (processed?.length) {
            nextSnake.processed = processed;
          }

          nextSnakes.push(nextSnake);
        });

      updateStores({ snakes: nextSnakes, foods: food });
    },
    run: (nextState) => {
      render(nextState);
    },
  }).start();
};

function App() {
  useEffect(() => {
    main();
    eventControl.init();
  }, []);

  return <Area />;
}

root.render(
  <>
    <GameTemplate>
      <App />
    </GameTemplate>
  </>
);
