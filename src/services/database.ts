import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "just-post-it.db");
export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  },
);

export const sql = {
  execute: async (query: string, values?: string[]) => {
    return await new Promise((resolve, reject) => {
      db.run(query, values, (err) => {
        if (err) {
          console.info(err);
          reject(err);
        }
        resolve(null);
      });
    });
  },
  get: async (query: string, values?: string[]): Promise<any[]> => {
    return await new Promise((resolve, reject) => {
      db.all(query, values, (err: Error, row) => {
        if (err) {
          console.info(err);
          return reject(err);
        }
        return resolve(row);
      });
    });
  },
};
