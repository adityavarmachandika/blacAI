import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Threads table
export const threads = pgTable('threads', {
  id: uuid('id').primaryKey(), // generate manually
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  systemPrompt: text('system_prompt'),
  isArchived: boolean('is_archived').default(false).notNull(),
  userId: uuid('user_id').references(() => user_details.google_id, { onDelete: 'cascade' }).notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey(), // generate manually
  role: text('role').notNull(),
  content: text('content').notNull(),
  isStreaming: boolean('is_streaming').default(false).notNull(),
  tokens: integer('tokens'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  model: text('model'),
  threadId: uuid('thread_id').references(() => threads.id, { onDelete: 'cascade' }).notNull(),
});

// API Configs
export const apiConfigs = pgTable('api_configs', {
  id: uuid('id').primaryKey(), // generate manually
  provider: text('provider').notNull(),
  apiKey: text('api_key').notNull(),
  model: text('model').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  user_id: uuid('user_id').references(() => user_details.google_id, { onDelete: 'cascade' }).notNull(),
});

// Attachments
export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey(), // generate manually
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  storageKey: text('storage_key').notNull(),
  messageId: uuid('message_id').references(() => messages.id, { onDelete: 'cascade' }).notNull(),
});

export const user_details=pgTable('user_details', {
  google_id: uuid('id').primaryKey(), // generate manually
  name: text('name').notNull(),
  email: text('email').notNull(),
})
// Relations
export const threadsRelations = relations(threads, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  message: one(messages, {
    fields: [attachments.messageId],
    references: [messages.id],
  }),
}));
