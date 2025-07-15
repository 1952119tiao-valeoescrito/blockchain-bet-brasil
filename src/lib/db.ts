// Arquivo: lib/db.ts

const DB_NAME = 'BlockchainBetDB';
const DB_VERSION = 1;
const STORE_NAME = 'apostas';

// Variável para guardar a instância do banco.
// A tipagem IDBDatabase vem nativamente com o TypeScript para ambientes de DOM.
let db: IDBDatabase;

// Interface para definir o formato dos seus dados.
// Isso é uma das grandes vantagens do TS!
export interface Aposta {
  id?: number; // O 'id' será opcional, pois é gerado automaticamente
  numeros: string; // Ex: "15/24"
  valor: number;
  data: string;
}

// Função para iniciar o banco de dados
export const initDB = (): Promise<void> => {
  // A verificação continua sendo a chave do sucesso!
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log('Banco de dados IndexedDB iniciado com sucesso!');
      resolve();
    };

    request.onerror = (event) => {
      console.error('Erro ao iniciar o IndexedDB:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Função para adicionar uma nova aposta
// Usamos a interface Aposta para garantir que os dados estão corretos.
export const addData = (data: Omit<Aposta, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não foi inicializado.');

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

// Função para buscar todas as apostas
export const getAllData = (): Promise<Aposta[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não foi inicializado.');

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Aposta[]);
    request.onerror = () => reject(request.error);
  });
};