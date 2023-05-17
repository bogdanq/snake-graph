export type VertexType = "FOOD" | "SNAKE" | "FUNNEL" | "EMPTY" | "FUNNEL_OUT";

export type Vertex = {
  type?: VertexType;
  id?: string;
  siblings?: number[];
};

export type GraphType = { [key: string]: Required<Vertex> };
