// Arquivo: hooks/useDatabase.ts

import { useState, useEffect, useCallback } from 'react';
import { initDB, addData, getAllData, Aposta } from '@/lib/db'; // Importando do nosso db.ts

// Definindo os tipos para o que o nosso hook vai retornar
interface UseDatabaseReturn {
  isDBReady: boolean;
  error: DOMException | string | null;
  addDataToDB: (data: Omit<Aposta, 'id'>) => Promise<number | void>;
  getAllDataFromDB: () => Promise<Aposta[]>;
}

const useDatabase = (): UseDatabaseReturn => {
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [error, setError] = useState<DOMException | string | null>(null);

  // useEffect para inicializar o DB no lado do cliente
  useEffect(() => {
    initDB()
      .then(() => setIsDBReady(true))
      .catch(err => setError(err));
  }, []); // Array vazio para rodar só uma vez

  const addDataToDB = useCallback(async (data: Omit<Aposta, 'id'>) => {
    if (!isDBReady) {
      setError('DB não está pronto.');
      return;
    }
    try {
      return await addData(data);
    } catch (err) {
      setError(err as DOMException);
    }
  }, [isDBReady]);

  const getAllDataFromDB = useCallback(async (): Promise<Aposta[]> => {
    if (!isDBReady) {
      setError('DB não está pronto.');
      return [];
    }
    try {
      return await getAllData();
    } catch (err) {
      setError(err as DOMException);
      return [];
    }
  }, [isDBReady]);

  return { error, isDBReady, addDataToDB, getAllDataFromDB };
};

export default useDatabase;