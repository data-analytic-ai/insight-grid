'use client';

import React, {useState} from 'react';
import {useSidebar} from '@/store/SidebarContext';
import Link from 'next/link';
import {
    FolderSync,
    LayoutDashboard,
    Database,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {ModeToggle} from '@/components/ui/ThemeModeToggle';
import {usePathname} from 'next/navigation';
import {DatabaseConnectionManager} from '@/components/DatabaseConnectionManager';
import {Button} from '@/components/ui/button';

interface SidebarProps {
    className?: string;
}

export default function Sidebar({className}: SidebarProps) {
    const {isSidebarCollapsed, toggleSidebarCollapse} = useSidebar();
    const pathname = usePathname(); // Get the current route for active state

    // Function to determine if the item is active
    const isActive = (path: string) => pathname === path;

    // State to manage the expansion of the connections submenu
    const [connectionsExpanded, setConnectionsExpanded] = useState<boolean>(false);

    const handleConnect = (connection: any) => {
        // Handle the connection logic here
        // For example, you can update the global state or navigate to a specific page
        console.log('Connecting to:', connection);
    };

    return (
        <div
            className={`bg-background flex h-full flex-col justify-between ${
                isSidebarCollapsed ? 'w-16' : 'w-64'
            } transition-all duration-300 ease-in-out ${className}`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between py-3 h-16 border-b border-border px-4">
                <h1
                    className={`text-muted-foreground text-2xl ${
                        isSidebarCollapsed ? 'hidden' : 'block'
                    }`}
                >
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

            {/* Navigation Menu */}
            <div className="flex-1 p-2">
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/dashboard"
                            className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${
                                isActive('/dashboard') ? 'bg-muted' : ''
                            }`}
                        >
                            <LayoutDashboard
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span
                                className={`ml-2 text-muted-foreground ${
                                    isSidebarCollapsed ? 'hidden' : 'block'
                                }`}
                            >
                Dashboard
              </span>
                        </Link>
                    </li>
                    <li>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Link
                                    href="/data_explorer"
                                    className={`flex items-center flex-grow p-2 rounded-md hover:bg-primary transition-colors duration-200 ${
                                        isActive('/data_explorer') ? 'bg-muted' : ''
                                    }`}
                                >
                                    <Database
                                        className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                                    <span
                                        className={`ml-2 text-muted-foreground ${
                                            isSidebarCollapsed ? 'hidden' : 'block'
                                        }`}
                                    >
                                         Data Explorer
                                    </span>
                                </Link>
                                {!isSidebarCollapsed && (
                                    <button
                                        onClick={() => setConnectionsExpanded(!connectionsExpanded)}
                                        className="p-2 focus:outline-none"
                                        aria-label={
                                            connectionsExpanded ? 'Collapse connections' : 'Expand connections'
                                        }
                                    >
                                        {connectionsExpanded ? (
                                            <ChevronLeft className="w-4 h-4 text-muted-foreground hover:bg-primary"/>
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-muted-foreground hover:bg-primary"/>
                                        )}
                                    </button>
                                )}
                            </div>
                            {!isSidebarCollapsed && connectionsExpanded && (
                                <div className="ml-4 mt-2">
                                    <DatabaseConnectionManager
                                        isCollapsed={isSidebarCollapsed}
                                        onConnect={handleConnect}
                                    />
                                </div>
                            )}
                        </div>
                    </li>
                    <li>
                        <Link
                            href="/data_transfer"
                            className={`flex items-center p-2 rounded-md hover:bg-primary transition-colors duration-200 ${
                                isActive('/data_transfer') ? 'bg-muted' : ''
                            }`}
                        >
                            <FolderSync
                                className="w-6 h-6 text-muted-foreground hover:text-primary-foreground transition-colors duration-200"/>
                            <span
                                className={`ml-2 text-muted-foreground ${
                                    isSidebarCollapsed ? 'hidden' : 'block'
                                }`}
                            >
                Data Transfer
              </span>
                        </Link>
                    </li>
                    {/* Additional menu items can be added here */}
                </ul>
            </div>

            {/* Mode Toggle at the bottom */}
            <div className="p-4">
                <div className="absolute bottom-4 left-4">
                    <ModeToggle/>
                </div>
            </div>
        </div>
    );
}
