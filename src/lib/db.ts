import Dexie, { type EntityTable } from 'dexie';

export type LocalIdentity = {
    id: string;
    privateKeyJwk: JsonWebKey;
    publicKeyJwk: JsonWebKey;
};

// Initialize the Database
const db = new Dexie('RootChatDatabase') as Dexie & {
    messages: EntityTable<Message, 'id'>;
    identity: EntityTable<LocalIdentity, 'id'>; 
};

// Define all tables and indexes in a single version block
db.version(1).stores({
    // The first item 'id' is the Primary Key. 
    // [conversationId+createdAt] creates a high-performance compound index.
    messages: 'id, conversationId, [conversationId+createdAt], syncStatus',
    identity: 'id'
});

export { db };