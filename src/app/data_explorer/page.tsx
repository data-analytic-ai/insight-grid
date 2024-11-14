"use client"

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Workspace from "@/components/Workspace";
import useCanvasStore from "@/store/useCanvasStore";

export default function DataExplorerPage() {
    const {data: session, status} = useSession();
    const [newElements, setNewElements] = useState([]);
    const setNodes = useCanvasStore((state) => state.setNodes);

    const handleNewNode = (node: any) => {
        setNewElements((prev) => [...prev, node]);
    };

/*    useEffect(() => {
        setNodes(newElements);
        console.log('newElements', newElements);
    }, [newElements, setNodes]);*/

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session || status === 'unauthenticated') {
        return <div>Por favor, inicia sesión para acceder.</div>;
    }

    return (
        <div className="h-full w-full">
            <Workspace
                conversationId="1"
                newElements={newElements}
                onNewNode={handleNewNode}

                onMessage={(message) => {
                    console.log('Message:', message);
                }
                }
                visibility='local'


            />
        </div>
    );


}
