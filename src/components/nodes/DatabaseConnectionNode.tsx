import React, { memo, useState } from 'react';
import {Handle, NodeResizer, Position, useReactFlow} from '@xyflow/react';
import {Database, Plus, ArrowLeft} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import DatabaseConnectionForm from '../DatabaseConnectionForm';
import DynamicTables from '@/components/DynamicTables';

const DatabaseConnectionNode = ({ id, data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionId, setConnectionId] = useState(null);
    const [, setConnectionData] = useState(null);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Obtener y aplicar el ancho y alto desde data
    const width = data.width || 300;
    const height = data.height || 150;
    // Obtener setNodes para actualizar los nodos
    const { setNodes } = useReactFlow();

    // Manejador de redimensionamiento
    const onResize = (event, params) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            width: params.width,
                            height: params.height,
                        },
                    };
                }
                return node;
            })
        );
    };

    const handleBack = () => {
        // Resetear el estado de conexión
        setIsConnected(false);
        setConnectionId(null);
        setConnectionData(null);
    };

    const handleCreateNewConnection = () => {
        // Resetear el estado de conexión para crear una nueva
        setIsConnected(false);
        setConnectionId(null);
        setConnectionData(null);
    };

    const lineStyle = {border: '2px solid #e5e7eb', borderRadius: '20px'};

    return(
        <div
            className="relative"

        >
            <NodeResizer lineStyle={lineStyle} minWidth={100} minHeight={40} isVisible={id}  />
            <Handle type="target" position={Position.Top} />

            {/* Card Component */}
            <Card className="w-full h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                        <Database className="w-4 h-4 inline-block mr-2" />
                        Database Connection
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        {isConnected && (
                            <Button variant="ghost" size="sm" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={toggleExpand}>
                                        {isExpanded ? 'Collapse' : 'Expand'}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isExpanded ? 'Collapse node' : 'Expand node for more details'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent className="overflow-auto h-full">
                    <AnimatePresence>
                        {!isConnected ? (
                            <DatabaseConnectionForm
                                onConnect={(connData, connId) => {
                                    setIsConnected(true);
                                    setConnectionData(connData);
                                    setConnectionId(connId);
                                }}
                            />
                        ) : (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {isExpanded ? (
                                    <DynamicTables connectionId={connectionId} />
                                ) : (
                                    <div className="flex flex-col items-center space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Connected to database. Expand to view schema.
                                        </p>
                                        <Button variant="outline" size="sm" onClick={handleCreateNewConnection}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            New Connection
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.data.isConnected === nextProps.data.isConnected &&
        prevProps.id === nextProps.id &&
        prevProps.data.width === nextProps.data.width &&
        prevProps.data.height === nextProps.data.height
    );
};

export default memo(DatabaseConnectionNode, areEqual);

function ResizeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="16 20 20 20 20 16" />
            <line x1="14" y1="14" x2="20" y2="20" />
            <polyline points="8 4 4 4 4 8" />
            <line x1="4" y1="4" x2="10" y2="10" />
        </svg>
    );
}
