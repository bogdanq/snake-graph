import { useMemo } from "react";
import ReactFlow, { useNodesState, Background } from "reactflow";
import "reactflow/dist/style.css";

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
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        selectNodesOnDrag={false}
        panOnDrag={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        maxZoom={1}
        minZoom={1}
      >
        {/* <Controls /> */}
        <Background />
      </ReactFlow>
    </div>
  );
};
