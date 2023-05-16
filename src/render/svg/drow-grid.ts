import * as d3 from "d3";
import { CONSTANTS } from "../../constants";

export const drowGrid = () => {
  const svg = d3
    .select("#grid")
    .attr("width", CONSTANTS.PAGE_WIDTH)
    .attr("height", CONSTANTS.PAGE_HEIGHT);

  svg
    .selectAll("line#vertical")
    .data<number[]>(
      Array.from({
        length: CONSTANTS.getHorizontalCellCount()
      })
    )
    .enter()
    .append("line")
    .attr("id", "vertical")
    .attr("x1", (data, index) => {
      return (index + 1) * CONSTANTS.CELL_SIZE;
    })
    .attr("y1", 0)
    .attr("x2", (data, index) => {
      return (index + 1) * CONSTANTS.CELL_SIZE;
    })
    .attr("y2", CONSTANTS.PAGE_HEIGHT)
    .attr("stroke", "#e5e5e5")
    .style("stroke-width", 1);

  svg
    .selectAll("line#horizontal")
    .data<number[]>(Array.from({ length: CONSTANTS.getVerticalCellCount() }))
    .enter()
    .append("line")
    .attr("id", "horizontal")
    .attr("x1", 0)
    .attr("y1", (data, index) => {
      return (index + 1) * CONSTANTS.CELL_SIZE;
    })
    .attr("x2", CONSTANTS.PAGE_WIDTH)
    .attr("y2", (data, index) => {
      return (index + 1) * CONSTANTS.CELL_SIZE;
    })
    .attr("stroke", "#e5e5e5")
    .style("stroke-width", 1);
};
