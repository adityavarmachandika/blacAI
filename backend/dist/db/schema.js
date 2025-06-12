"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsRelations = exports.messagesRelations = exports.threadsRelations = exports.attachments = exports.apiConfigs = exports.messages = exports.threads = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Threads table
exports.threads = (0, pg_core_1.pgTable)('threads', {
    id: (0, pg_core_1.uuid)('id').primaryKey(), // generate manually
    title: (0, pg_core_1.text)('title').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    systemPrompt: (0, pg_core_1.text)('system_prompt'),
    isArchived: (0, pg_core_1.boolean)('is_archived').default(false).notNull(),
});
// Messages table
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey(), // generate manually
    role: (0, pg_core_1.text)('role').notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    isStreaming: (0, pg_core_1.boolean)('is_streaming').default(false).notNull(),
    tokens: (0, pg_core_1.integer)('tokens'),
    timestamp: (0, pg_core_1.timestamp)('timestamp', { withTimezone: true }).defaultNow().notNull(),
    model: (0, pg_core_1.text)('model'),
    threadId: (0, pg_core_1.uuid)('thread_id').references(() => exports.threads.id, { onDelete: 'cascade' }).notNull(),
});
// API Configs
exports.apiConfigs = (0, pg_core_1.pgTable)('api_configs', {
    id: (0, pg_core_1.uuid)('id').primaryKey(), // generate manually
    provider: (0, pg_core_1.text)('provider').notNull(),
    apiKey: (0, pg_core_1.text)('api_key').notNull(),
    model: (0, pg_core_1.text)('model').notNull(),
    isDefault: (0, pg_core_1.boolean)('is_default').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
// Attachments
exports.attachments = (0, pg_core_1.pgTable)('attachments', {
    id: (0, pg_core_1.uuid)('id').primaryKey(), // generate manually
    fileName: (0, pg_core_1.text)('file_name').notNull(),
    fileType: (0, pg_core_1.text)('file_type').notNull(),
    fileSize: (0, pg_core_1.integer)('file_size').notNull(),
    fileUrl: (0, pg_core_1.text)('file_url').notNull(),
    storageKey: (0, pg_core_1.text)('storage_key').notNull(),
    messageId: (0, pg_core_1.uuid)('message_id').references(() => exports.messages.id, { onDelete: 'cascade' }).notNull(),
});
// Relations
exports.threadsRelations = (0, drizzle_orm_1.relations)(exports.threads, ({ many }) => ({
    messages: many(exports.messages),
}));
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one, many }) => ({
    thread: one(exports.threads, {
        fields: [exports.messages.threadId],
        references: [exports.threads.id],
    }),
    attachments: many(exports.attachments),
}));
exports.attachmentsRelations = (0, drizzle_orm_1.relations)(exports.attachments, ({ one }) => ({
    message: one(exports.messages, {
        fields: [exports.attachments.messageId],
        references: [exports.messages.id],
    }),
}));
