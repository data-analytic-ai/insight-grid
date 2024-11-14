'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    ArrowRightIcon,
    DatabaseIcon,
    FileIcon,
    TableIcon,
    CheckCircleIcon,
    XCircleIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DataTransferComponent from '@/components/datatransfer/DataTransferComponent';

export default function EasyDataTransfer() {
    const [sourceType, setSourceType] = useState('');
    const [destinationType, setDestinationType] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);
    const [progress, setProgress] = useState(0);
    const [transferComplete, setTransferComplete] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState(false);

    const handleTransfer = () => {
        setIsTransferring(true);
        setProgress(0);
        setTransferComplete(false);

        // Simulación de transferencia
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setIsTransferring(false);
                    setTransferComplete(true);
                    // Simular éxito o fallo aleatorio
                    setTransferSuccess(Math.random() > 0.2);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 500);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">EasyDataTransfer</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Origen de Datos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Origen de Datos</CardTitle>
                        <CardDescription>Selecciona la fuente de tus datos</CardDescription>
                    </CardHeader>
                    <CardContent >
                        <Select onValueChange={setSourceType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de origen" />
                            </SelectTrigger>
                            <SelectContent className={"bg-background"}>
                                <SelectItem value="database">
                                    <DatabaseIcon className="inline-block mr-2" />
                                    Base de Datos
                                </SelectItem>
                                <SelectItem value="file">
                                    <FileIcon className="inline-block mr-2" />
                                    Archivo
                                </SelectItem>
                                <SelectItem value="api">
                                    <TableIcon className="inline-block mr-2" />
                                    API
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Condicional para mostrar detalles del origen */}
                        {sourceType === 'database' ? (
                            <div className="mt-4">
                                <DataTransferComponent
                                    type="source"
                                />
                            </div>
                        ) : sourceType ? (
                            <div className="mt-4">
                                <Label htmlFor="sourceDetails">Detalles del Origen</Label>
                                <Input
                                    id="sourceDetails"
                                    placeholder="Ingresa los detalles del origen"
                                />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                {/* Destino de Datos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Destino de Datos</CardTitle>
                        <CardDescription>
                            Selecciona dónde quieres transferir tus datos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setDestinationType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de destino" />
                            </SelectTrigger>
                            <SelectContent  className={"bg-background"}>
                                <SelectItem value="database">
                                    <DatabaseIcon className="inline-block mr-2" />
                                    Base de Datos
                                </SelectItem>
                                <SelectItem value="file">
                                    <FileIcon className="inline-block mr-2" />
                                    Archivo
                                </SelectItem>
                                <SelectItem value="api">
                                    <TableIcon className="inline-block mr-2" />
                                    API
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {/* Condicional para mostrar detalles del destino */}
                        {destinationType === 'database' ? (
                            <div className="mt-4">
                                <DataTransferComponent
                                    type="destination"
                                />
                            </div>
                        ) : destinationType ? (
                            <div className="mt-4">
                                <Label htmlFor="destinationDetails">Detalles del Destino</Label>
                                <Input
                                    id="destinationDetails"
                                    placeholder="Ingresa los detalles del destino"
                                />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            {/* Configuración de Transferencia */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Configuración de Transferencia</CardTitle>
                    <CardDescription>
                        Configura y ejecuta tu transferencia de datos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-center">
                            <div className="font-semibold">
                                {sourceType || 'Origen'}
                            </div>
                            {sourceType === 'database' ? (
                                <DatabaseIcon className="mx-auto mt-2" />
                            ) : sourceType === 'file' ? (
                                <FileIcon className="mx-auto mt-2" />
                            ) : sourceType === 'api' ? (
                                <TableIcon className="mx-auto mt-2" />
                            ) : (
                                <DatabaseIcon className="mx-auto mt-2" />
                            )}
                        </div>
                        <ArrowRightIcon className="text-primary" />
                        <div className="text-center">
                            <div className="font-semibold">
                                {destinationType || 'Destino'}
                            </div>
                            {destinationType === 'database' ? (
                                <DatabaseIcon className="mx-auto mt-2" />
                            ) : destinationType === 'file' ? (
                                <FileIcon className="mx-auto mt-2" />
                            ) : destinationType === 'api' ? (
                                <TableIcon className="mx-auto mt-2" />
                            ) : (
                                <DatabaseIcon className="mx-auto mt-2" />
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleTransfer}
                        disabled={!sourceType || !destinationType || isTransferring}
                        className="w-full"
                    >
                        {isTransferring ? 'Transfiriendo...' : 'Iniciar Transferencia'}
                    </Button>
                    {isTransferring && (
                        <div className="mt-4">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center mt-2">{progress}% Completado</p>
                        </div>
                    )}
                    {transferComplete && (
                        <Alert
                            className="mt-4"
                            variant={transferSuccess ? 'default' : 'destructive'}
                        >
                            {transferSuccess ? (
                                <CheckCircleIcon className="h-4 w-4" />
                            ) : (
                                <XCircleIcon className="h-4 w-4" />
                            )}
                            <AlertTitle>
                                {transferSuccess
                                    ? 'Transferencia Exitosa'
                                    : 'Error en la Transferencia'}
                            </AlertTitle>
                            <AlertDescription>
                                {transferSuccess
                                    ? 'Tus datos han sido transferidos correctamente. Puedes ver los detalles en la página de reportes.'
                                    : 'Ha ocurrido un error durante la transferencia. Por favor, intenta nuevamente o contacta al soporte técnico.'}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
