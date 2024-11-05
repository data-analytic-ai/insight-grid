'use client';


import {CreateMessage, Message, useChat, UseChatHelpers} from 'ai/react';
import React, {createContext, useCallback, useContext,} from "react";
import {ensureMessageId, ensureToolResult} from "@/lib/utils/util";
import Ide from "@/components/ide";
import InteractiveCanvas from "@/components/InteractiveCanvas";
import {useSession} from "next-auth/react";

// TODO: support public/private DBs that live in the cloud
export type Visibility = 'local' | 'public' | 'private'

export type WorkspaceProps = {
    /**
     * The unique ID for a conversation.
     * A conversation is a collection of messages, the workspace and app state.
     * This ID is used to identify the conversation in the database.
     */
    conversationId: string

    /**
     * The visibility of this conversation.
     * - `local` means the database is stored locally in the client side or theirs own db config.
     */
    visibility: Visibility

    /**
     * Callback called after the user sends a message.
     */
    onMessage?: (
        message: Message | CreateMessage,
        append: UseChatHelpers['append']
    ) => void | Promise<void>

    /**
     * Callback called when the user is replying to a message.
     */
    onReply?: (message: Message, append: UseChatHelpers['append']) => void | Promise<void>;

    /**
     * Callback called when the user cancels a reply.
     */
    onCancelReply?: (append: UseChatHelpers['append']) => void | Promise<void>;

    /**
     * New elements to be added to the workspace.
     */
    newElements: any[];

    /**
     * nodes from The chat component to be added to the workspace.
     */
    onNewNode: (node: any) => void;
}


export default function Workspace({
                                      conversationId,
                                      onMessage,
                                      onReply,
                                      onCancelReply,
                                      newElements,
                                      onNewNode
                                  }: WorkspaceProps) {

    const {data: session} = useSession();
    const userId = session?.user as string;

    if (!session) {
        return <div>Por favor, inicia sesión para acceder.</div>;
    }

   /* useEffect(() => {
        const verifyAndFetchState = async () => {
            try {
                if (!userId) return console.error('No userId found');

                const exists = await verifyUserExistsInDb(userId);

                if (exists) {
                    console.log('User exists in DB');
                    // Lógica para cargar el estado del usuario
                } else {
                    console.log('User does not exist in DB');
                    // Lógica para crear un nuevo estado para el usuario
                }
            } catch (error) {
                console.error('Error verifying user in DB:', error);
            }
        };

        verifyAndFetchState();
    }, [userId]);*/


    const {messages, setMessages, append, stop} = useChat({
        id: conversationId,
        api: '/api/chat',
        maxToolRoundtrips: 10,
        keepLastMessageOnError: true,
        initialMessages: [],
        async onFinish(message) {
            await onReply?.(message, append);
        },
    });

    const appendMessage = useCallback(
        async (message: Message | CreateMessage) => {
            setMessages((messages) => {
                const isModified = ensureToolResult(messages)
                return isModified ? [...messages] : messages
            })
            ensureMessageId(message)
            // Intentionally don't await so that framer animations aren't affected
            append(message)
            onMessage?.(message, append)
        },
        [onMessage, setMessages, append]
    );

    const stopReply = useCallback(async () => {
        stop()
        onCancelReply?.(append);
    }, [stop, onCancelReply, append]);


    return (
        <WorkspaceContext.Provider value={{
            conversationId: conversationId,
            messages,
            appendMessage,
            stopReply,
            newElements,
            onNewNode
        }}>
            <div className="w-full h-full lg:flex flex-col lg:flex-row gap-8">
                <Ide className="flex-1 sm:py-6 sm:pl-6">

                    <InteractiveCanvas newElements={newElements}/>
                </Ide>
            </div>
        </WorkspaceContext.Provider>
    )
}

export type WorkspaceContextValues = {
    conversationId: string
    messages: Message[]
    appendMessage: (message: Message | CreateMessage) => void
    stopReply()
        :
        Promise<void>
    newElements: any[],
    onNewNode: (node: any) => void
}

export const WorkspaceContext = createContext
    < WorkspaceContextValues | undefined > (undefined)

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if (!context) {
        throw new Error('WorkspaceContext missing. Are you accessing useWorkspace() outside of a Workspace?')
    }
    return context
}