import { IDatabaseAdapter } from './IDatabaseAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';

// Singleton instance of the active database adapter
export const db: IDatabaseAdapter = new LocalStorageAdapter();

export * from './IDatabaseAdapter';
export * from './LocalStorageAdapter';
