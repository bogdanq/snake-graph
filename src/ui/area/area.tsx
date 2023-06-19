import { useStore } from "effector-react";
import { useMemo } from "react";
import ReactFlow, { useNodesState, Background } from "reactflow";
import "reactflow/dist/style.css";
import { $currentSnake } from "../../game";

import { SnakesArea } from "./snakes-area";

const initialNodes = [
  {
    id: "2",
    type: "selectorNode",
    data: { label: "Node 2" },
    position: { x: 0, y: 0 },
    dragHandle: "dragHandle",
  },
];

export const Area = () => {
  const [nodes] = useNodesState(initialNodes);
  const snake = useStore($currentSnake);

  const nodeTypes = useMemo(() => {
    return {
      // область с елементами
      selectorNode: () => (
        <>
          <SnakesArea />
        </>
      ),
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        selectNodesOnDrag={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        zoomOnScroll={true}
        maxZoom={1}
        minZoom={snake?.isCrash === false ? 1 : 0.3}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};
