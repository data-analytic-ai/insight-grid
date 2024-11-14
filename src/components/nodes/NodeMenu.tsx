'use client';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {nodeTypes} from '@/components/InteractiveCanvas.constants';
import useCanvasStore from "@/store/useCanvasStore";
import {v4 as uuidV4} from 'uuid';


export default function NodeMenu({open, onClose}) {
    const addNode = useCanvasStore((state) => state.addNode);

    const handleAddNode = (type: string) => {
        const position = {x: Math.random() * 250, y: Math.random() * 250};
        const newNode = {
            id: `${type}-${uuidV4()}`,
            type,
            position,
            data: {label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`},
        }
        addNode(newNode);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center min-h-screen">
                <div
                    className="bg-background rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <DialogHeader className="bg-primary text-primary px-4 py-2">
                        <DialogTitle>Ops Library</DialogTitle>
                        <DialogDescription>Select one to add</DialogDescription>
                    </DialogHeader>
                    <DialogContent className="bg-background p-4">
                        <div className="w-64 p-4">
                            {Object.entries(nodeTypes).map(([type]) => (
                                <button
                                    key={type}
                                    className="w-full bg-primary hover:bg-secondary  px-4 py-2 rounded mb-2"
                                    onClick={() => {
                                        handleAddNode(type);
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </DialogContent>
                </div>
            </DialogContent>
        </Dialog>
    );
}
