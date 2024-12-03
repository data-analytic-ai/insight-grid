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
import { ArrowRightIcon, DatabaseIcon, FileIcon, TableIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DataTransferComponent from '@/components/datatransfer/DataTransferComponent';

export default function DataTransfer() {
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

        // Transfer simulation
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setIsTransferring(false);
                    setTransferComplete(true);
                    // Simulate random success or failure
                    setTransferSuccess(Math.random() > 0.2);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 500);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Data Transfer</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Source */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Source</CardTitle>
                        <CardDescription>Select your data source</CardDescription>
                    </CardHeader>
                    <CardContent >
                        <Select onValueChange={setSourceType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select source type" />
                            </SelectTrigger>
                            <SelectContent className={"bg-background"}>
                                <SelectItem value="database">
                                    <DatabaseIcon className="inline-block mr-2" />
                                    Database
                                </SelectItem>
                                {/* Commented out as per request
                                <SelectItem value="file">
                                    <FileIcon className="inline-block mr-2" />
                                    File
                                </SelectItem>
                                <SelectItem value="api">
                                    <TableIcon className="inline-block mr-2" />
                                    API
                                </SelectItem>
                                */}
                            </SelectContent>
                        </Select>
                        {/* Conditional rendering for source details */}
                        {sourceType === 'database' ? (
                            <div className="mt-4">
                                <DataTransferComponent
                                    type="source"
                                />
                            </div>
                        ) : sourceType ? (
                            <div className="mt-4">
                                <Label htmlFor="sourceDetails">Source Details</Label>
                                <Input
                                    id="sourceDetails"
                                    placeholder="Enter source details"
                                />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                {/* Data Destination */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Destination</CardTitle>
                        <CardDescription>
                            Select where you want to transfer your data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setDestinationType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select destination type" />
                            </SelectTrigger>
                            <SelectContent  className={"bg-background"}>
                                <SelectItem value="database">
                                    <DatabaseIcon className="inline-block mr-2" />
                                    Database
                                </SelectItem>
                                {/* Commented out as per request
                                <SelectItem value="file">
                                    <FileIcon className="inline-block mr-2" />
                                    File
                                </SelectItem>
                                <SelectItem value="api">
                                    <TableIcon className="inline-block mr-2" />
                                    API
                                </SelectItem>
                                */}
                            </SelectContent>
                        </Select>
                        {/* Conditional rendering for destination details */}
                        {destinationType === 'database' ? (
                            <div className="mt-4">
                                <DataTransferComponent
                                    type="destination"
                                />
                            </div>
                        ) : destinationType ? (
                            <div className="mt-4">
                                <Label htmlFor="destinationDetails">Destination Details</Label>
                                <Input
                                    id="destinationDetails"
                                    placeholder="Enter destination details"
                                />
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>

            {/* Transfer Configuration */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Transfer Configuration</CardTitle>
                    <CardDescription>
                        Configure and execute your data transfer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-center">
                            <div className="font-semibold">
                                {sourceType || 'Source'}
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
                                {destinationType || 'Destination'}
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
                        {isTransferring ? 'Transferring...' : 'Start Transfer'}
                    </Button>
                    {isTransferring && (
                        <div className="mt-4">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center mt-2">{progress}% Complete</p>
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
                                    ? 'Transfer Successful'
                                    : 'Transfer Error'}
                            </AlertTitle>
                            <AlertDescription>
                                {transferSuccess
                                    ? 'Your data has been transferred successfully. You can view the details on the reports page.'
                                    : 'An error occurred during the transfer. Please try again or contact technical support.'}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

