import { Typography, Row, Tooltip, Layout } from "antd";
// @ts-ignore
import { FpsView } from "react-fps";
import {
  PoweroffOutlined,
  PauseOutlined,
  RedoOutlined,
  SearchOutlined,
  CloseOutlined,
  EyeOutlined,
  RobotOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

import * as S from "./game-template.styled";
import { useState } from "react";
import { useStore } from "effector-react";
import {
  $snakes,
  GameStatus,
  pauseGame,
  restartGame,
  startGame,
} from "../../../game";

const { Content } = Layout;

export const GameTemplate = ({
  children,
  gameStatus,
}: {
  children: React.ReactElement;
  gameStatus: GameStatus;
}) => {
  const [isVisible, setVisible] = useState(true);

  const snakes = useStore($snakes);

  const snakesInGame = snakes.filter((s) => !s.isCrash);

  const toggleVisible = () => {
    setVisible((s) => !s);
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {isVisible && (
        <S.FpsWrapper>
          <FpsView top="calc(100% - 80px)" height={0} />
        </S.FpsWrapper>
      )}

      <Layout style={{ height: "100%" }}>
        <S.Header>
          <Row>
            <Typography.Title level={5}>Главная</Typography.Title>
            <Typography.Title level={5}>С ботами</Typography.Title>
            <Typography.Title level={5}>Онлайн</Typography.Title>
          </Row>

          <Row align="middle">
            <EyeOutlined />
            <Tooltip placement="bottom" title="Отображение панелей">
              <Typography.Title level={5} onClick={toggleVisible}>
                {isVisible ? "Скрыть" : "Показать"}
              </Typography.Title>
            </Tooltip>
          </Row>
        </S.Header>

        <Layout hasSider>
          <Content>{children}</Content>

          <S.Wrapper isVisible={isVisible}>
            <Row>
              <Tooltip placement="top" title="Скрыть">
                <CloseOutlined className="close" />
              </Tooltip>
            </Row>

            <Row align="middle">
              <RobotOutlined className="icon" />
              <Typography.Text>
                Ботов: {snakes?.length || 0} - всего,{" "}
                {snakesInGame?.length || 0} - в игре
              </Typography.Text>
            </Row>
          </S.Wrapper>
        </Layout>

        <S.Footer isVisible={isVisible}>
          <Row align="middle">
            <Row align="middle">
              {gameStatus === "RUNING" ? (
                <>
                  <PauseOutlined />
                  <Typography.Title onClick={() => pauseGame()} level={5}>
                    Пауза
                  </Typography.Title>
                </>
              ) : (
                <>
                  <PlayCircleOutlined />
                  <Typography.Title onClick={() => startGame()} level={5}>
                    Запустить
                  </Typography.Title>
                </>
              )}
            </Row>

            <Row align="middle">
              <RedoOutlined />
              <Typography.Title onClick={() => restartGame()} level={5}>
                Рестарт
              </Typography.Title>
            </Row>

            <Row align="middle">
              <PoweroffOutlined />
              <Typography.Title level={5}>Добавить бота</Typography.Title>
            </Row>

            <Row align="middle">
              <SearchOutlined />
              <Typography.Title level={5}>Свой алгоритм</Typography.Title>
            </Row>
          </Row>
        </S.Footer>
      </Layout>
    </div>
  );
};
