"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const storeToDatabase = async (thread_id, content, model) => {
    let threadId = thread_id;
    if (thread_id == null) {
        threadId = (0, uuid_1.v4)(); // Generate a new thread ID if not provided
        const threadDetails = {
            id: threadId,
            title: content.slice(0, 20), // Use first 20 characters as title
            createdAt: new Date(),
            updatedAt: new Date(),
            systemPrompt: null,
            isArchived: false,
        };
        await db_1.db.insert(schema_1.threads).values(threadDetails);
    }
    const messageDetails = {
        id: (0, uuid_1.v4)(),
        role: 'user',
        content: content,
        isStreaming: true,
        tokens: 0, // Placeholder, you can calculate tokens if needed
        timestamp: new Date(),
        model: model,
        threadId: threadId,
    };
    await db_1.db.insert(schema_1.messages).values(messageDetails)
        .then(() => {
        console.log("Message stored successfully");
    })
        .catch((error) => {
        console.error("Error storing message:", error);
    });
};
exports.default = storeToDatabase;
