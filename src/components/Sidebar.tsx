'use client';

import React, {useContext, useEffect, useState} from 'react';
import {useSidebar} from '@/store/SidebarContext';
import Link from 'next/link';
import {
    FolderSync,
    LayoutDashboard,
    Database,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronUp, ChevronDown
} from 'lucide-react';
import {ModeToggle} from '@/components/ui/ThemeModeToggle';
import {usePathname} from 'next/navigation';
import axiosInstance from "@/lib/utils/axiosInstance";
import {FormStateContext} from "@/store/form-state-provider";

interface SidebarProps {
    className?: string;
}

export default function Sidebar({className}: SidebarProps) {
    const {isSidebarCollapsed, toggleSidebarCollapse} = useSidebar();
    const pathname = usePathname(); // Obtener la ruta actual para el estado activo

    // Estado para la lista de conexiones y manejo de submenú
    const [connections, setConnections] = useState<any[]>([]);
    const [connectionsExpanded, setConnectionsExpanded] = useState<boolean>(false); // Para manejar la expansión del submenú
    const [loadingConnections, setLoadingConnections] = useState<boolean>(false);
    // Función para determinar si el ítem está activo
    const isActive = (path: string) => pathname === path;

    // Dentro del componente
    const formStateContext = useContext(FormStateContext);
    if (!formStateContext) {
        throw new Error("Sidebar must be used within a FormStateProvider");
    }
    const {setConnected} = formStateContext;


    useEffect(() => {
        const fetchConnections = async () => {
            setLoadingConnections(true);
            try {
                const response = await axiosInstance.get('/query/bridge/database/connections');
                setConnections(response.data);
            } catch (error) {
                console.error('Error fetching connections:', error);
            } finally {
                setLoadingConnections(false);
            }
        };

        fetchConnections();
    }, []);
    return (
        <div
            className={`bg-background flex h-full flex-col justify-between ${
                isSidebarCollapsed ? 'w-16' : 'w-64'
            } transition-all duration-300 ease-in-out ${className}`}
        >
            {/* Header del Sidebar */}
            <div className="flex items-center justify-between py-3 h-16 border-b border-border px-4">
                <h1 className={`text-muted-foreground text-2xl  ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                    Data Analytic
                </h1>
                <button className="hover:ring focus:outline-none" onClick={toggleSidebarCollapse}>
                    {isSidebarCollapsed ? (
                        <ChevronRight className="w-6 h-6"/>
                    ) : (
                        <ChevronLeft className="w-6 h-6"/>
                    )}
                </button>
            </div>

            {/* Menú de navegación */}
            <div className="flex-1 p-2">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard"
                              className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${isActive('/dashboard') ? 'bg-muted' : ''}`}>
                            <LayoutDashboard
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span className={`ml-2 text-muted-foreground ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                Dashboard
                            </span>
                        </Link>
                    </li>
                    <li>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Link
                                    href="/data_explorer"
                                    className={`flex items-center flex-grow p-2 rounded-md hover:bg-primary transition-colors duration-200 ${isActive('/data_explorer') ? 'bg-muted' : ''}`}
                                >
                                    <Database
                                        className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"
                                    />
                                    <span
                                        className={`ml-2 text-muted-foreground ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                        Data Explorer
                                     </span>
                                </Link>
                                {!isSidebarCollapsed && (
                                    <button
                                        onClick={() => setConnectionsExpanded(!connectionsExpanded)}
                                        className="p-2 focus:outline-none"
                                        aria-label={connectionsExpanded ? "Collapse connections" : "Expand connections"}
                                    >
                                        {connectionsExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-muted-foreground hover:bg-primary"/>
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground hover:bg-primary"/>
                                        )}
                                    </button>
                                )}
                            </div>
                            {!isSidebarCollapsed && connectionsExpanded && (
                                <ul className="ml-6 mt-2 space-y-1">
                                    {loadingConnections ? (
                                        <li className="text-muted-foreground">Loading connections...</li>
                                    ) : connections.length === 0 ? (
                                        <li className="text-muted-foreground">No connections found.</li>
                                    ) : (
                                        connections.map((connection) => (
                                            <li key={connection.connectionId}>
                                                <Link
                                                    href={`/data_explorer/${connection.connectionId}`}
                                                    className={`flex items-center p-1 rounded-md hover:bg-primary transition-colors duration-200 ${isActive(`/data_explorer/${connection.connectionId}`) ? 'bg-muted' : ''}`}
                                                    onClick={() => {
                                                        // Actualizar el estado global de la conexión
                                                        setConnected(true, connection, connection.connectionId);
                                                    }}
                                                >
                                                    <span
                                                        className="text-muted-foreground">{connection.databaseName}</span>
                                                </Link>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    </li>


                    <li>
                        <Link href="/data_transfer"
                              className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${isActive('/data_transfer') ? 'bg-muted' : ''}`}>
                            <FolderSync
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span className={`ml-2 text-muted-foreground ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                Data Transfer
                            </span>
                        </Link>
                    </li>
                   {/* <li>
                        <Link href="/reports"
                              className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${isActive('/reports') ? 'bg-muted' : ''}`}>
                            <FileText
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span className={`ml-2 text-muted-foreground ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                Reports
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings"
                              className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${isActive('/settings') ? 'bg-muted' : ''}`}>
                            <Settings
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span className={`ml-2 text-muted-foreground ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                                Settings
                            </span>
                        </Link>
                    </li>*/}
                </ul>
            </div>

            {/* Mode Toggle en la parte inferior */}
            <div className="p-4">
                <div className="absolute bottom-4 left-4">
                    <ModeToggle/>
                </div>
            </div>
        </div>
    );
}