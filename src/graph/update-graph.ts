import { Food, Funnel, Snake } from "../game";
import { graphController } from "./graph-controller";
import { geIndexByPosition } from "./utils";

export const markFoodOnGraph = (food: Food[]) => {
  food.forEach(([position, id]) => {
    graphController.setValueByIndex(geIndexByPosition(position), {
      type: "FOOD",
      id,
    });
  });
};

// TODO сделать порталы как еду с uniq id
export const markFunnelOnGraph = (funnels: Funnel[]) => {
  funnels.forEach(([funnelIn, funnelOut]) => {
    graphController.setValueByIndex(funnelIn, {
      type: "FUNNEL",
      id: "funnel-id",
      siblings: [funnelOut],
    });

    graphController.setValueByIndex(funnelOut, {
      type: "FUNNEL_OUT",
      id: "funnel-id",
    });
  });
};

export const markSnakeOnGraph = (snakes: Snake[]) => {
  snakes.forEach((snake) => {
    snake.body.forEach(([index]) => {
      graphController.setValueByIndex(index, {
        type: "SNAKE",
        id: snake.id,
      });
    });
  });
};

export const markEmptyCellOnGraph = (empty: [number, string][]) => {
  empty.forEach(([index, id]) => {
    graphController.setValueByIndex(index, {
      type: "EMPTY",
      id,
    });
  });
};
