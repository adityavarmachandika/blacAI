import Dexie from "dexie";
import type { Table } from "dexie";

export interface Threads {
  thread_id: number;
  title: string;
  created_at?: Date;
  updated_at: Date;
  system_prompt?: string;
  isArchived: boolean;
}

export interface Messages {
  message_id: number;
  role: string;
  content: string;
  isStreaming: boolean;
  tokens?: number;
  timestamp: Date;
  model: string;
  thread_id: number;
}

export interface Attachments {
  file_id: number;
  file_name: string;
  file_type: string;
  file_size: string;
  file_data: string;
  message_id: number;
}

export class ChatDataBase extends Dexie {
  threads!: Table<Threads, number>;
  messages!: Table<Messages, number>;
  attachments!: Table<Attachments, number>;

  constructor() {
    super("blacAI");

    // Create the schema
    this.version(1).stores({
      threads: "thread_id, title, updated_at, isArchived",
      messages: "message_id, role, content, isStreaming, timestamp, model, thread_id",
      attachments: "file_id, file_name, file_type, file_size, file_data, message_id",
    });

    // Creating hooks to update the timestamps
    // this.threads.hook("creating", function (_primKey: number, obj: Threads) {
    //   obj.created_at = new Date();
    //   obj.updated_at = new Date();
    // });

    // this.threads.hook("updating", function (modifications: Partial<Threads>) {
    //   modifications.updated_at = new Date();
    // });

    // this.messages.hook("creating", function (_primKey: number, obj: Messages) {
    //   obj.timestamp = obj.timestamp || new Date();
    // });
  }
}


export const db= new ChatDataBase();