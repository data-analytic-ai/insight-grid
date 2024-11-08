"use client";

import React, {createContext, useState, ReactNode, useCallback, useEffect} from 'react';

interface DbConnectionData {
    databaseType: string;
    host: string;
    port: number | '';
    databaseName: string;
    userName: string;
    password: string;
    sid?: string;
    instance?: string;
}

interface FormState {
    isConnected: boolean;
    connectionData: DbConnectionData | null;
    connectionId: string | null;
    setConnected: (isConnected: boolean, connectionData: DbConnectionData | null, connectionId: string) => void;
}

interface FormStateContextType extends FormState {
    setConnected:(isConnected: boolean, connectionData: DbConnectionData | null, connectionId: string) => void;
}

export const FormStateContext = createContext<FormStateContextType | undefined>(undefined);

export const FormStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    useEffect(() => {
        const storedConnectionId = localStorage.getItem('connectionId');
        if (storedConnectionId) {
            setConnectionId(storedConnectionId);
            setIsConnected(true);
            // Opcionalmente, puedes recuperar y establecer connectionData desde localStorage

        }
    }, []);


    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionData, setConnectionData] = useState<DbConnectionData | null>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);

    const setConnected = ((isConnected: boolean, connectionData: DbConnectionData | null, connectionId: string) => {
        setIsConnected(isConnected);
        setConnectionData(connectionData);
        setConnectionId(connectionId);
        localStorage.setItem('connectionId', connectionId);
    });

    return (
        <FormStateContext.Provider value={{ isConnected, connectionData, setConnected, connectionId }}>
            {children}
        </FormStateContext.Provider>
    );
};
