'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ConnectionDetails from '@/components/ConnectionDetails'; // Un componente que muestra información relevante de la conexión

const DataExplorerConnectionPage = () => {
    const params = useParams();
    const { connectionId } = params;

    // Usa connectionId para obtener la conexión y mostrar los datos

    return (
        <div>
            <ConnectionDetails connectionId={connectionId }/>
        </div>
    );
};

export default DataExplorerConnectionPage;