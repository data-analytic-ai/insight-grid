"use client";

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Server, User, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { useSession } from "next-auth/react";
import axiosInstance from '@/lib/utils/axiosInstance';
import { v4 as uuidv4 } from 'uuid';
import InputField from "@/components/InputField";

interface DatabaseConnectionFormProps {
    onConnect: (formData: FormData, connectionId: any) => void;
}

const databaseManagers = [
    { value: 'postgresql', label: 'PostgreSQL', defaultPort: 5432 },
    { value: 'mysql', label: 'MySQL', defaultPort: 3306 },
    { value: 'sqlserver', label: 'SQL Server', defaultPort: 1433 },
    { value: 'oracle', label: 'Oracle', defaultPort: 1521 },
    { value: 'db2', label: 'DB2', defaultPort: 50000 },
];

interface FormData {
    databaseType: string;
    jdbcUrl: string;
    host?: string;
    port?: number | '';
    databaseName?: string;
    userName: string;
    password: string;
    sid?: string;
    instance?: string;
    connectionId?: string;
}

const DatabaseConnectionForm: React.FC<DatabaseConnectionFormProps> = ({ onConnect }) => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Por favor, inicia sesión para acceder a este formulario.</div>;
    }

    const [formData, setFormData] = useState<FormData>({
        databaseType: '',
        jdbcUrl: '',
        host: 'localhost',
        port: '',
        databaseName: '',
        userName: '',
        password: '',
        sid: '',
        instance: '',
    });

    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDatabaseTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDatabaseType = e.target.value;
        const defaultPort = databaseManagers.find(db => db.value === newDatabaseType)?.defaultPort || '';
        setFormData((prev) => ({
            ...prev,
            databaseType: newDatabaseType,
            port: defaultPort,
            // Resetear campos específicos
            sid: newDatabaseType === 'oracle' ? prev.sid : '',
            instance: newDatabaseType === 'sqlserver' ? prev.instance : '',
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const connectionId = uuidv4();

        let connectionData: FormData = {
            connectionId,
            jdbcUrl: formData.jdbcUrl,
            databaseType: formData.databaseType,
            userName: formData.userName,
            password: formData.password,
        };

        if (showAdvanced) {
            // Construir la URL JDBC a partir de los campos avanzados en el backend
            connectionData = {
                ...connectionData,
                host: formData.host,
                port: formData.port,
                databaseName: formData.databaseName,
                sid: formData.sid,
                instance: formData.instance,
            };
        } else {
            // Utilizar la URL JDBC ingresada
            connectionData = {
                ...connectionData,
                jdbcUrl: formData.jdbcUrl,
            };
        }

        // Verifica que el token esté disponible
        if (!session) {
            setError('Authentication error. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/query/bridge/database/connect', connectionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                onConnect(formData, connectionId);
            } else {
                const errorMsg = response.data?.message || 'Failed to connect to the database.';
                setError(`Conexión fallida: ${errorMsg}`);
            }
        } catch (err: any) {
            console.error('Error al conectar con la base de datos', err);
            const errorMsg = err.response?.data?.message || 'Error al conectar con la base de datos';
            setError(`Error al conectar con la base de datos: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mt-4">
                    <h2 className="font-bold text-xl mb-4 text-center">
                        Database Connection
                    </h2>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="databaseManager" className="block text-gray-700 mb-1">
                                Database Manager
                            </label>
                            <select
                                id="databaseManager"
                                name="databaseType"
                                value={formData.databaseType}
                                onChange={handleDatabaseTypeChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="" disabled>
                                    Select a Database Manager
                                </option>
                                {databaseManagers.map((manager) => (
                                    <option key={manager.value} value={manager.value}>
                                        {manager.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo para la URL JDBC */}
                        <InputField
                            icon={Database}
                            type="text"
                            id="jdbcUrl"
                            name="jdbcUrl"
                            value={formData.jdbcUrl}
                            onChange={handleChange}
                            placeholder="JDBC URL"
                            required={!showAdvanced}
                        />

                        {/* Botón para mostrar/ocultar opciones avanzadas */}
                        <button
                            type="button"
                            className="text-blue-500 underline mb-4 flex items-center"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            {showAdvanced ? (
                                <>
                                    <ChevronUp className="mr-1" />
                                    hide advanced options
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-1" />
                                    show advanced options
                                </>
                            )}
                        </button>

                        {/* Campos avanzados */}
                        {showAdvanced && (
                            <>
                                <InputField
                                    icon={Server}
                                    type="text"
                                    id="host"
                                    name="host"
                                    value={formData.host}
                                    onChange={handleChange}
                                    placeholder="Host"
                                    required
                                />
                                <InputField
                                    icon={Database}
                                    type="number"
                                    id="port"
                                    name="port"
                                    value={formData.port}
                                    onChange={handleChange}
                                    placeholder="Port"
                                    required
                                />
                                <InputField
                                    icon={Database}
                                    type="text"
                                    id="databaseName"
                                    name="databaseName"
                                    value={formData.databaseName}
                                    onChange={handleChange}
                                    placeholder="Database Name"
                                    required
                                />
                                {/* Campos específicos según el tipo de base de datos */}
                                {formData.databaseType === 'oracle' && (
                                    <InputField
                                        icon={Database}
                                        type="text"
                                        id="sid"
                                        name="sid"
                                        value={formData.sid || ''}
                                        onChange={handleChange}
                                        placeholder="SID"
                                        required
                                    />
                                )}
                                {formData.databaseType === 'sqlserver' && (
                                    <InputField
                                        icon={Database}
                                        type="text"
                                        id="instance"
                                        name="instance"
                                        value={formData.instance || ''}
                                        onChange={handleChange}
                                        placeholder="Instance Name"
                                        required
                                    />
                                )}
                            </>
                        )}

                        <InputField
                            icon={User}
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="User"
                            required
                        />
                        <InputField
                            icon={Key}
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        {error && (
                            <div className="text-red-500 text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading || (!formData.jdbcUrl && !showAdvanced)}
                            className={`w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                            } flex items-center justify-center transition-colors duration-200`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            ) : (
                                'Connect'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default React.memo(DatabaseConnectionForm);
