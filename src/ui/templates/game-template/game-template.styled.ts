import { styled } from "styled-components";

export const Wrapper = styled.div<{ isVisible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 15px 10px;
  color: #fff;
  border-radius: 8px;
  cursor: default;
  width: ${({ isVisible }) => (isVisible ? "320px" : 0)};
  overflow: hidden;
  margin-top: 1%;
  margin-right: 1%;
  transition: all 0.3s;
  z-index: 10;
  background-color: #7dbcea75;
  box-shadow: 5px 5px 10px #7dbceadb;
  height: 94%;
  row-gap: 15px;

  &:hover {
    cursor: move;
    box-shadow: 5px 5px 10px #108ee9;
  }

  & .close {
    cursor: pointer;
  }

  & .icon {
    margin-right: 5px;
  }

  & span {
    color: #fff;
  }
`;

export const Footer = styled.div<{ isVisible: boolean }>`
  z-index: 10;
  background-color: #7dbcea75;
  box-shadow: -5px -5px 10px #7dbceadb;
  padding: 5px 30px;
  color: #fff;
  cursor: default;
  width: 100%;
  transition: all 0.3s;
  height: ${({ isVisible }) => (isVisible ? "35px" : 0)};
  overflow: hidden;

  &:hover {
    cursor: move;
    box-shadow: -5px -5px 10px #108ee9;
  }

  & h5 {
    margin-top: 0 !important;
    margin-bottom: 0;
    color: white;
    padding-right: 30px;
    padding-left: 5px;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    & .ant-row {
      width: 100%;
    }
  }
`;

export const Header = styled.div`
  z-index: 10;
  background-color: #7dbcea75;
  box-shadow: 5px 5px 10px #7dbceadb;
  display: flex;
  padding: 5px 30px;
  color: #fff;
  cursor: default;
  width: 100%;
  transition: all 0.3s;
  justify-content: space-between;
  overflow: hidden;

  &:hover {
    cursor: move;
    box-shadow: 5px 5px 10px #108ee9;
  }

  & h5 {
    margin-top: 0 !important;
    margin-bottom: 0;
    padding-right: 45px;
    padding-left: 5px;
    color: white;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    & h5 {
      width: 100%;
    }
  }
`;

export const FpsWrapper = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 0;
  top: calc(100% - 80px);

  & div {
    background-color: #7dbcea75 !important;
    color: #fff !important;
  }
`;
