import { useEffect } from "react";
import styled from "styled-components";
import { CONSTANTS } from "../../constants";
import { svgRender } from "../../render";
import { useAsixScroll } from "./use-asix-scroll";

const Wrapper = styled.div`
  border: 1px solid #e5e5e5;
  width: ${CONSTANTS.PAGE_WIDTH}px;
  height: ${CONSTANTS.PAGE_HEIGHT}px;
  background: #fff;
`;

export const SnakesArea = () => {
  useEffect(() => {
    svgRender.drowGrid();
  }, []);

  // useAsixScroll();

  return (
    <Wrapper id="snakes-area">
      <svg id="grid" />
      <svg
        id="snake-container"
        width={CONSTANTS.PAGE_WIDTH}
        height={CONSTANTS.PAGE_HEIGHT}
      />
    </Wrapper>
  );
};
