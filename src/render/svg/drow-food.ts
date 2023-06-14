import * as d3 from "d3";
import { CONSTANTS } from "../../constants";
import { Food, LoopStore } from "../../game";
// @ts-ignore
import foodIcon from "../../assets/food.svg";
import { getGlobalPositionByCoord } from "../../graph";
import { StoreValue } from "effector";

export const drowFood = ({ food }: StoreValue<LoopStore>) => {
  const w = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;
  const h = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;

  const svg = d3
    .select("#snake-container")
    .selectAll<SVGSVGElement, Food[]>("image#food")
    .data(food, (food, ids) => {
      // @ts-ignore
      return String(food[1].id);
    });

  svg.exit().remove();

  svg
    .enter()
    .append("image")
    .attr("xlink:href", foodIcon)
    .attr("id", "food")
    .attr("x", function (food, i) {
      return getGlobalPositionByCoord(food[0])[0] + w / 2;
    })
    .attr("y", function (food) {
      return getGlobalPositionByCoord(food[0])[1] + h / 2;
    })
    .transition()
    .duration(750)
    .ease(d3.easeBounce)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("x", function (food, i) {
      return getGlobalPositionByCoord(food[0])[0] + CONSTANTS.SNAKE_PADDING / 2;
    })
    .attr("y", function (food) {
      return getGlobalPositionByCoord(food[0])[1] + CONSTANTS.SNAKE_PADDING / 2;
    })
    .attr("width", w)
    .attr("height", h);
};
