import * as d3 from "d3";
import { CONSTANTS } from "../../constants";
// @ts-ignore
import funnelIcon from "../../assets/hole3.jpg";
// @ts-ignore
import funnelInIcon from "../../assets/hole-in.png";
import { getFunnelColor } from "../../snake-helpers";
import { Funnel, LoopStore } from "../../game";
import { StoreValue } from "effector";
import { getGlobalPositionByIndex, graphController } from "../../graph";

export const drowFunnel = ({ funnel }: StoreValue<LoopStore>) => {
  funnel.forEach((funnel, idx) => {
    const svg = d3
      .select("#snake-container")
      .selectAll<SVGSVGElement, [number, number]>(`svg#funnel-${idx}`)
      .data(funnel, (f) => {
        return String(f);
      });

    svg.exit().remove();

    const w = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;
    const h = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;

    const container = svg
      .enter()
      .append("svg")
      .attr("id", `funnel-${idx}`)
      .attr("width", w)
      .attr("height", h)
      .attr("x", function (f, i) {
        return getGlobalPositionByIndex(f)[0] + CONSTANTS.SNAKE_PADDING / 2;
      })
      .attr("y", function (f) {
        return getGlobalPositionByIndex(f)[1] + CONSTANTS.SNAKE_PADDING / 2;
      });

    container
      .append("image")
      .attr("xlink:href", (i, idx) => {
        return idx ? funnelIcon : funnelInIcon;
      })
      .attr("width", w)
      .attr("height", h);
  });
};

export const drowFunnelStroke = (funnels: Funnel[], id: string) => {
  let render: [number, number][] = [];

  funnels.forEach(([fIn, fOut], idx) => {
    render = render.concat(
      // @ts-ignore
      graphController.getSiblings(fIn).map((v) => [v, idx]),
      graphController.getSiblings(fOut).map((v) => [v, idx])
    );
  });

  const svg = d3
    .select("#snake-container")
    .selectAll<SVGSVGElement, number[]>(`rect#funnel-stroke-${id}`)
    .data(render);

  svg.exit().remove();

  const w = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;
  const h = CONSTANTS.CELL_SIZE - CONSTANTS.SNAKE_PADDING;

  svg
    .enter()
    .append("rect")
    .attr("id", `funnel-stroke-${id}`)
    .attr("width", w)
    .attr("height", h)
    .attr("x", function ([v], i) {
      return getGlobalPositionByIndex(v)[0] + CONSTANTS.SNAKE_PADDING / 2;
    })
    .attr("y", function ([v]) {
      return getGlobalPositionByIndex(v)[1] + CONSTANTS.SNAKE_PADDING / 2;
    })
    // @ts-ignore
    .style("fill", ([_, idx]) => {
      return getFunnelColor(idx);
    });
};
