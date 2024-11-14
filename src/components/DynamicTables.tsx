"use client";

import React, {useState, useEffect, useCallback, useContext} from 'react';
import axiosInstance from '@/lib/utils/axiosInstance';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useSession, signIn} from "next-auth/react";
import {FormStateContext} from "@/store/form-state-provider";
import ConnectionsManager from "@/components/ConnectionManager";

export default function DynamicTables({connectionId}: { connectionId: string }) {
    const {data: session, status} = useSession();
    const formStateContext = useContext(FormStateContext);

    if (!formStateContext) {
        throw new Error("DynamicTables must be used within a FormStateProvider");
    }


    const [tables, setTables] = useState<string[]>([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [selectedTableData, setSelectedTableData] = useState<Record<string, any>>({});
    const apiUrl = process.env.NEXT_PUBLIC_QUERY_BRIDGE_API_URL;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchTables = async () => {
            if (status !== 'authenticated') {
                signIn("google");
                return;
            }

            if (!connectionId) {
                setError('No connection ID found. Please connect to the database.');
                return;
            }

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/query/bridge/database/listTables/${connectionId}`);
                setTables(response.data || []);
                console.log('Tables:', response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    console.error('Connection expired or not available:', error);
                    setError('Connection expired or not available. Please reconnect.');
                } else {
                    console.error('Error al obtener las tablas:', error);
                    setError('An error occurred while fetching tables.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (apiUrl) fetchTables();
    }, [apiUrl, status, connectionId]);

    const fetchAllTableData = useCallback(async (newPage = 0, size = 10) => {
        if (!selectedTables.length) return;

        if (status !== 'authenticated') {
            signIn("google");
            return;
        }

        if (!connectionId) {
            setError('No connection ID found. Please connect to the database.');
            return;
        }



        setLoading(true);
        const newTableData: Record<string, any> = {};

        for (const tableName of selectedTables) {
            try {
                const response = await axiosInstance.get(`/query/bridge/database/data/${connectionId}/${tableName}?page=${newPage}&size=${size}`);
                if (response.data) {
                    newTableData[tableName] = {
                        columns: response.data.columns,
                        rows: response.data.rows,
                        pageSize: response.data.pageSize,
                        totalRows: response.data.totalRows,
                        currentPage: newPage,
                    };
                }
            } catch (error: any) {
                console.error(`Error fetching data for table ${tableName}:`, error);
                setError(`Error fetching data for table ${tableName}.`);
            }
        }

        setSelectedTableData(newTableData);
        setLoading(false);
    }, [selectedTables, status, , connectionId]);

    useEffect(() => {
        if (selectedTables.length) {
            fetchAllTableData();
        }
    }, [fetchAllTableData, selectedTables]);

    const handleSelectTable = (value: string) => {
        setSelectedTables([value]);
    };

    const handleChangePage = async (tableName: string, newPage: number) => {
        setLoading(true);
        await fetchAllTableData(newPage);
        setLoading(false);
    };

    if (status === "loading" || loading) {
        return <div>Loading...</div>; // Puedes reemplazar esto con un componente de carga personalizado
    }

    if (status === "unauthenticated") {
        // Redirigir al inicio de sesión si no está autenticado
        signIn("google");
        return <p>Redirigiendo al inicio de sesión...</p>;
    }

    if ( !connectionId) {
        // Si no hay conexión,se va mostrar el componente ConnectionsManager
        return (
            <div>
                <p>No connection established. Please connect to the database.</p>
                <ConnectionsManager/>
            </div>
        );
    }

    return <>
        <div className="container mx-auto p-4">
            {error && (
                <div className="mb-4 text-red-500">
                    {error}
                </div>
            )}
            <div className="mb-4  bg-background">
                <label htmlFor="table-select" className="block text-gray-800">Tablas</label>
                <Select onValueChange={handleSelectTable}>
                    <SelectTrigger className="w-full bg-gray-200 px-3 py-2 border border-gray-300 rounded-md">
                        <SelectValue className={"text-black"}
                                     placeholder={selectedTables.length ? selectedTables.join(', ') : "Selecciona una tabla"}/>
                    </SelectTrigger>
                    <SelectContent className={"bg-background"}>
                        <SelectGroup>
                            <SelectLabel>Tablas</SelectLabel>
                            {tables.map((table) => (
                                <SelectItem key={table} value={table}>{table}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {selectedTables.map((tableName) => (
                <React.Fragment key={tableName}>
                    {selectedTableData[tableName] ? (
                        <div className="overflow-auto mb-4 border border-gray-300 rounded-md">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-200">
                                <tr>
                                    {selectedTableData[tableName].columns.map((column: any) => (
                                        <th key={column.COLUMN_NAME} className="px-4 py-2 border-b border-gray-200">
                                            {column.COLUMN_NAME?.replace('_', ' ').toUpperCase() || "N/A"}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {selectedTableData[tableName].rows.map((row: any, rowIndex: number) => (
                                    <tr key={`row-${row.id || rowIndex}`}>
                                        {selectedTableData[tableName].columns.map((column: any) => (
                                            <td key={`cell-${column.COLUMN_NAME}-${rowIndex}`}
                                                className="px-4 py-2 border-b border-gray-200">
                                                {row[column.COLUMN_NAME]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {selectedTableData[tableName].rows.length === 0 && (
                                    <tr>
                                        <td colSpan={selectedTableData[tableName].columns.length}
                                            className="px-4 py-2 text-center">
                                            No data
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center p-4">
                                <button
                                    onClick={() => handleChangePage(tableName, selectedTableData[tableName].currentPage - 1)}
                                    disabled={selectedTableData[tableName].currentPage === 0}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {selectedTableData[tableName].currentPage + 1} of {Math.ceil(selectedTableData[tableName].totalRows / selectedTableData[tableName].pageSize)}
                                </span>
                                <button
                                    onClick={() => handleChangePage(tableName, selectedTableData[tableName].currentPage + 1)}
                                    disabled={(selectedTableData[tableName].currentPage + 1) * selectedTableData[tableName].pageSize >= selectedTableData[tableName].totalRows}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>No data</div>
                    )}
                </React.Fragment>
            ))}
        </div>
    </>
};