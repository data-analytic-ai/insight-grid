'use client';

import React from 'react';
import {useSidebar} from '@/store/SidebarContext';
import {useSession} from "next-auth/react";

interface ContentAreaProps {
    children: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({children}) => {
    const {isSidebarCollapsed} = useSidebar();
    const {data: session} = useSession();

    if (!session) {
        return <div>Por favor, inicia sesión para acceder.</div>;
    }

    return (
        <main
            className={`w-full bg-background overflow-auto transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'ml-0' : 'ml-0'
            } p-0`}
        >
            {children}
        </main>
    );
};

export default ContentArea;
