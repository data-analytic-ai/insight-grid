import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '@/lib/utils/axiosInstance';
import { FormStateContext } from "@/store/form-state-provider";

const ConnectionsManager: React.FC = () => {
    const formStateContext = useContext(FormStateContext);
    if (!formStateContext) {
        throw new Error("ConnectionsManager must be used within a FormStateProvider");
    }
    const { setConnected } = formStateContext;

    const [userConnections, setUserConnections] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await axiosInstance.get('/query/bridge/database/connections');
                setUserConnections(response.data);
            } catch (error) {
                console.error('Error fetching connections:', error);
                setError('Error fetching connections.');
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const handleReconnect = async (connectionId: string) => {
        try {
            const connection = userConnections.find(c => c.connectionId === connectionId);
            if (connection) {
                // Enviar la solicitud para establecer la conexión
                const response = await axiosInstance.post('/query/bridge/database/connect', connection);
                // Actualizar el estado
                setConnected(true, connection, connection.connectionId);
                // Opcional: Mostrar mensaje de éxito
            }
        } catch (error) {
            console.error('Error reconnecting:', error);
            setError('Error reconnecting.');
        }
    };

    if (loading) {
        return <div>Loading connections...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Your Saved Connections</h2>
            {userConnections.length === 0 ? (
                <p>No saved connections found.</p>
            ) : (
                <ul>
                    {userConnections.map(connection => (
                        <li key={connection.connectionId} className="mb-2">
                            <span>{connection.databaseName} ({connection.databaseType})</span>
                            <button
                                onClick={() => handleReconnect(connection.connectionId)}
                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                            >
                                Reconnect
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ConnectionsManager;
