'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/utils/axiosInstance';

interface ConnectionDetailsProps {
    connectionId;
}

const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({ connectionId }) => {
    const [connectionData, setConnectionData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnectionDetails = async () => {
            try {
                const response = await axiosInstance.get(`/query/bridge/database/connection/${connectionId}`);
                setConnectionData(response.data);
            } catch (error) {
                console.error('Error fetching connection details:', error);
                setError('Error fetching connection details.');
            } finally {
                setLoading(false);
            }
        };

        fetchConnectionDetails();
    }, [connectionId]);

    if (loading) {
        return <div>Loading connection details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!connectionData) {
        return <div>No connection data available.</div>;
    }

    return (
        <div>
            <h2>Connection Details</h2>
            {/* Mostrar la información relevante de la conexión */}
            <p><strong>Database Name:</strong> {connectionData.databaseName}</p>
            <p><strong>Database Type:</strong> {connectionData.databaseType}</p>
            <p><strong>Host:</strong> {connectionData.host}</p>
            <p><strong>Port:</strong> {connectionData.port}</p>
            <p><strong>Username:</strong> {connectionData.username}</p>
            <p><strong>Connected:</strong> {connectionData.connected ? 'Yes' : 'No'}</p>
            <p><strong>Connection ID:</strong> {connectionData.connectionId}</p>
        </div>
    );
};

export default ConnectionDetails;
