import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    Database as DatabaseIcon,
    PlusCircle,
    MoreVertical,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import axiosInstance from '@/lib/utils/axiosInstance';

interface DatabaseConnection {
    connectionId: string;
    databaseName: string;
    databaseType: string;
    host: string;
    status: 'connected' | 'disconnected' | 'error';
}

interface DatabaseConnectionManagerProps {
    isCollapsed: boolean;
    onConnect: (connection: DatabaseConnection) => void;
}

export function DatabaseConnectionManager({
                                              isCollapsed,
                                              onConnect,
                                          }: DatabaseConnectionManagerProps) {
    const [connections, setConnections] = useState<DatabaseConnection[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newConnection, setNewConnection] = useState({
        databaseName: '',
        host: '',
        databaseType: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/query/bridge/database/connections');
                setConnections(
                    response.data.map((conn: any) => ({
                        ...conn,
                        status: 'connected', // or derive status based on your logic
                    }))
                );
            } catch (err) {
                console.error('Error fetching connections:', err);
                setError('Error fetching connections.');
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const addConnection = async () => {
        if (newConnection.databaseName && newConnection.host && newConnection.databaseType) {
            try {
                // Save the new connection to the server
                const response = await axiosInstance.post(
                    '/query/bridge/database/saveConnection',
                    newConnection
                );
                const savedConnection = {
                    ...response.data,
                    status: 'disconnected' as const,
                };
                setConnections([...connections, savedConnection]);
                setNewConnection({ databaseName: '', host: '', databaseType: '' });
                setIsAdding(false);
            } catch (err) {
                console.error('Error adding connection:', err);
                setError('Error adding connection.');
            }
        }
    };

    const deleteConnection = async (connectionId: string) => {
        try {
            await axiosInstance.delete(`/query/bridge/database/connection/${connectionId}`);
            setConnections(connections.filter((conn) => conn.connectionId !== connectionId));
        } catch (err) {
            console.error('Error deleting connection:', err);
            setError('Error deleting connection.');
        }
    };

    const getStatusIcon = (status: DatabaseConnection['status']) => {
        switch (status) {
            case 'connected':
                return <CheckCircle className="h-3 w-3 text-green-500" />;
            case 'disconnected':
                return <DatabaseIcon className="h-3 w-3 text-gray-500" />;
            case 'error':
                return <XCircle className="h-3 w-3 text-red-500" />;
        }
    };

    if (loading) {
        return <div>Loading connections...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (isCollapsed) {
        return (
            <div className="py-2">
                {connections.map((connection) => (
                    <div key={connection.connectionId} className="mb-2 text-center">
                        <Link href={`/data_explorer/${connection.connectionId}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => onConnect(connection)}
                            >
                                {getStatusIcon(connection.status)}
                            </Button>
                        </Link>
                    </div>
                ))}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setIsAdding(true)}
                >
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-1 overflow-y-scroll h-64">
            {connections.map((connection) => (
                <Collapsible key={connection.connectionId}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground">
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(connection.status)}
                            <span>{connection.databaseName}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 py-1 text-sm">
                        <p className="text-muted-foreground">{connection.host}</p>
                        <div className="flex justify-between mt-1">
                            <Link href={`/data_explorer/${connection.connectionId}`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                    onClick={() => onConnect(connection)}
                                >
                                    Connect
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => console.log('Edit', connection.connectionId)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => deleteConnection(connection.connectionId)}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
            {isAdding && (
                <div className="p-2 space-y-2">
                    <Label htmlFor="databaseName" className="sr-only">
                        Connection Name
                    </Label>
                    <Input
                        id="databaseName"
                        value={newConnection.databaseName}
                        onChange={(e) =>
                            setNewConnection({ ...newConnection, databaseName: e.target.value })
                        }
                        placeholder="Connection name"
                        className="h-7 text-sm"
                    />
                    <Label htmlFor="host" className="sr-only">
                        Host
                    </Label>
                    <Input
                        id="host"
                        value={newConnection.host}
                        onChange={(e) => setNewConnection({ ...newConnection, host: e.target.value })}
                        placeholder="Host address"
                        className="h-7 text-sm"
                    />
                    <Label htmlFor="databaseType" className="sr-only">
                        Database Type
                    </Label>
                    <Input
                        id="databaseType"
                        value={newConnection.databaseType}
                        onChange={(e) =>
                            setNewConnection({ ...newConnection, databaseType: e.target.value })
                        }
                        placeholder="Database type"
                        className="h-7 text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                        <Button onClick={addConnection} size="sm" className="h-7 px-2 text-xs">
                            Add
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsAdding(false)}
                            size="sm"
                            className="h-7 px-2 text-xs"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
            {!isAdding && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 py-1 text-sm"
                    onClick={() => setIsAdding(true)}
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Connection
                </Button>
            )}
        </div>
    );
}
