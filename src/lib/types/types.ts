import {
    Edge,
    Node,
    OnNodesChange,
    OnConnect,
    OnEdgesChange,
} from '@xyflow/react';
import {Message} from "ai";

export type AppNode = Node & {
    position: { x: number, y: number };
};

export type InteractiveCanvasState = {
    userId?: string;
    nodes: AppNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: AppNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (node: AppNode) => void;
    removeNode: (nodeId: string) => void;
    setNodeData: (id: string, data: any) => void;
};

export interface Conversation extends Record<string, any> {
    id: string
    title: string
    createdAt: Date
    userId: string
    path: string
    messages: Message[]
    sharePath?: string
}

/*Create the Message and Role Type*/


export interface Role {
    id: string;
    name: string;
}


/*
export interface AppNode {
    id: string;
    type: string;
    data: any;
    position: { x: number; y: number };
}*/
