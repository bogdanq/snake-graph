import * as d3 from "d3";
import { StoreValue } from "effector";
import { CONSTANTS } from "../../constants";
import { LoopStore, Snake, excludeSnakeHead, shakeHead } from "../../game";
import { drowFunnelStroke } from "./drow-funnel";
import { getGlobalPositionByIndex } from "../../graph";

export const drowSnake = ({ snakes, graph, funnel }: StoreValue<LoopStore>) => {
  const w = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;
  const h = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;

  const DUR = 1000 / CONSTANTS.FPS;

  const renderSnake = (body: Snake["body"], selector: string, snake: Snake) => {
    const svgHead = d3
      .select("#snake-container")
      .selectAll<SVGSVGElement, Snake["body"]>(`rect#${selector}`)
      .data(body, ([_, id]) => {
        return String(id);
      })
      .style("fill", () => {
        if (snake.isCrash) {
          return snake.colors.crashed;
        }

        return snake.colors.processed;
      });

    svgHead.exit().remove();

    svgHead
      .enter()
      .append("rect")
      .attr("id", selector)
      .attr("width", w)
      .attr("height", h)
      .attr("x", function ([idx]) {
        return getGlobalPositionByIndex(idx)[0] + CONSTANTS.SNAKE_PADDING / 2;
      })
      .attr("y", function ([idx]) {
        return getGlobalPositionByIndex(idx)[1] + CONSTANTS.SNAKE_PADDING / 2;
      })
      .attr("rx", 4)
      .attr("ry", 4);

    return svgHead;
  };

  const renderPath = (path: number[], snake: Snake) => {
    const svg = d3
      .select("#snake-container")
      .selectAll<SVGSVGElement, number[]>(`line#snake-path-${snake.id}`)
      .data(path, (idx) => {
        return String(idx);
      });

    svg.exit().remove();

    svg
      .enter()
      .append("line")
      .style("stroke", snake.colors.crashed)
      .style("stroke-width", 2)
      .attr("id", `snake-path-${snake.id}`)

      .attr("x1", function (index, idx) {
        return getGlobalPositionByIndex(index)[0] + CONSTANTS.CELL_SIZE / 2;
      })
      .attr("y1", function (index, idx) {
        return getGlobalPositionByIndex(index)[1] + CONSTANTS.CELL_SIZE / 2;
      })
      .attr("x2", function (index, idx) {
        if (path[idx + 1]) {
          return (
            getGlobalPositionByIndex(path[idx + 1])[0] + CONSTANTS.CELL_SIZE / 2
          );
        }

        return getGlobalPositionByIndex(index)[0] + CONSTANTS.CELL_SIZE / 2;
      })
      .attr("y2", function (index, idx) {
        if (path[idx + 1]) {
          return (
            getGlobalPositionByIndex(path[idx + 1])[1] + CONSTANTS.CELL_SIZE / 2
          );
        }

        return getGlobalPositionByIndex(index)[1] + CONSTANTS.CELL_SIZE / 2;
      });

    return svg;
  };

  const renderProcessed = (processed: number[], snake: Snake) => {
    const svg = d3
      .select("#snake-container")
      .selectAll<SVGSVGElement, number[]>(`rect#snake-processed-${snake.id}`)
      .data(processed, (idx) => {
        return String(idx);
      });

    svg.exit().remove();

    svg
      .enter()
      .append("rect")
      .attr("id", `snake-processed-${snake.id}`)
      .attr("width", w)
      .attr("height", h)
      .attr("x", function (index) {
        return getGlobalPositionByIndex(index)[0] + CONSTANTS.SNAKE_PADDING / 2;
      })
      .attr("y", function (index) {
        return getGlobalPositionByIndex(index)[1] + CONSTANTS.SNAKE_PADDING / 2;
      })
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill", snake.colors.tail);

    return svg;
  };

  snakes.forEach(({ snake }) => {
    const { id, colors, path, processed } = snake;

    const [nextSnake, head] = excludeSnakeHead([snake]);

    if (head) {
      drowFunnelStroke(
        funnel.filter(([funnelIn]) =>
          graph.graph[head[0]]?.siblings?.includes(funnelIn)
        ),
        id
      );
    }

    renderSnake(head?.length ? [head] : [], `snake-head-${id}`, snake)
      .enter()
      .selectAll(`rect#snake-head-${id}`)
      // @ts-ignore
      .attr("x", function ([idx]) {
        return getGlobalPositionByIndex(shakeHead(nextSnake)[0])[0];
      })
      // @ts-ignore
      .attr("y", function ([idx]) {
        return getGlobalPositionByIndex(shakeHead(nextSnake)[0])[1];
      })
      .style("fill", () => {
        return colors.head;
      })
      .transition()
      .duration(DUR)
      .ease(d3.easeLinear)
      // @ts-ignore
      .attr("x", function ([idx]) {
        return getGlobalPositionByIndex(idx)[0] + CONSTANTS.SNAKE_PADDING / 2;
      })
      // @ts-ignore
      .attr("y", function ([idx]) {
        return getGlobalPositionByIndex(idx)[1] + CONSTANTS.SNAKE_PADDING / 2;
      });

    renderSnake(nextSnake.body, `snake-body-${id}`, snake)
      .enter()
      .selectAll(`rect#snake-body-${id}`)
      .style("fill", () => {
        return colors.processed;
      });

    renderPath(path?.length ? path : [], snake);
    renderProcessed(processed?.length ? processed : [], snake);
  });
};
