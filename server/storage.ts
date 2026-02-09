import { db } from "./db";
import { feedback, type InsertFeedbackSchema } from "@shared/schema";

export interface IStorage {
  // We can add feedback storage later if needed
  logFeedback(message: string, isPositive: boolean): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async logFeedback(message: string, isPositive: boolean): Promise<void> {
    // Optional: Implement if we want to store user feedback
    // await db.insert(feedback).values({ message, isPositive });
    return Promise.resolve();
  }
}

export const storage = new DatabaseStorage();
