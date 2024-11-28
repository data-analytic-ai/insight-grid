import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import {addEdge, applyNodeChanges, applyEdgeChanges, Edge} from '@xyflow/react';
import {AppNode, InteractiveCanvasState} from "@/lib/types/types";

const useCanvasStore = create<InteractiveCanvasState>()(
    devtools(
        persist(
            (set, get) => {
                return ({
                    userId: '',
                    nodes: [] as AppNode[],
                    edges: [] as Edge[],
                    onNodesChange: (changes) => {
                        set((state) => {
                            const updatedNodes = applyNodeChanges(changes, state.nodes);
                            // Solo actualiza el estado si los nodos han cambiado
                            if (updatedNodes !== state.nodes) {
                                return {nodes: updatedNodes};
                            }
                            return state;
                        });
                    },
                    onEdgesChange: (changes) => {
                        set({
                            edges: applyEdgeChanges(changes, get().edges),
                        });
                    },
                    onConnect: (connection) => {
                        set({
                            edges: addEdge(connection, get().edges),
                        });
                    },
                    setNodes: (nodes) => {
                        set({nodes});
                    },
                    setEdges: (edges: Edge[]) => {
                        set({edges});
                    },
                    addNode: (node) => {
                        const nodesToAdd = get().nodes;
                        set({nodes: [...nodesToAdd, node]});
                    },
                    removeNode: (nodeId) => {
                        const nodes = get().nodes.filter((node) => node.id !== nodeId);
                        set({nodes});
                    },
                    setNodeData: (nodeId, data) => {
                        set((state) => {
                            const nodes = state.nodes.map((node) => {
                                if (node.id === nodeId) {
                                    const newData = {...node.data, ...data};
                                    if (JSON.stringify(newData) !== JSON.stringify(node.data)) {
                                        return {...node, data: newData};
                                    } else {
                                        return node; // Retorna el mismo objeto si los datos no cambiaron
                                    }
                                }
                                return node;
                            });
                            return {nodes};
                        });
                    },
                });
            },
            {
                name: 'interactive-canvas-storage', // Nombre del local storage
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export default useCanvasStore;
