import {generateId, Message} from "ai";
import {CreateMessage} from "ai/react";

/**
 * Ensures that a `Message` has an `id` by generating one if it
 * doesn't exist.
 */
export function ensureMessageId(message: Message | CreateMessage): asserts message is Message {
    if (!('id' in message)) {
        message.id = generateId()
    }
}

/**
 * Ensures that all tool invocations have a result before submitting,
 * otherwise the LLM provider will return an error.
 */
export function ensureToolResult(messages: Message[]) {
    let modified = false

    for (const message of messages) {
        if (!message.toolInvocations) {
            continue
        }

        for (const toolInvocation of message.toolInvocations) {
            if (!('result' in toolInvocation)) {
                Object.assign(toolInvocation, {
                    result: {
                        success: false,
                        error: 'Failed to complete',
                    },
                })
                modified = true
            }
        }
    }

    return modified
}