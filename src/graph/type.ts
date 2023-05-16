export type Vertex = {
  type?: string;
  id?: string;
  siblings?: number[];
};

export type GraphType = { [key: string]: Vertex };
