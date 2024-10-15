import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
    date: string;
    amount: number;
    type: string;
}

interface Client {
    id: string;
    name: string;
    debt: number;
    phone?: string;
    transactions: Transaction[];
}

interface ClientContextType {
    clients: Client[];
    addClient: (client: Omit<Client, 'id' | 'transactions'>) => void;
    getClientById: (id: string) => Client | undefined;
    addTransaction: (clientId: string, transaction: Transaction) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const loadClients = async () => {
            const storedClients = await AsyncStorage.getItem('clients');
            if (storedClients) {
                setClients(JSON.parse(storedClients));
            }
        };

        loadClients();
    }, []);

    useEffect(() => {
        const saveClients = async () => {
            await AsyncStorage.setItem('clients', JSON.stringify(clients));
        };

        saveClients();
    }, [clients]);

    const addClient = (client: Omit<Client, 'id' | 'transactions'>) => {
        const newClient: Client = {
            ...client,
            id: Math.random().toString(36).substr(2, 9),
            transactions: []
        };
        setClients((prevClients) => [...prevClients, newClient]);
    };

    const getClientById = (id: string) => {
        return clients.find(client => client.id === id);
    };

    const addTransaction = (clientId: string, transaction: Transaction) => {
        setClients(prevClients =>
            prevClients.map(client => {
                if (client.id === clientId) {
                    const newDebt = client.debt + (transaction.type === 'Deuda' ? transaction.amount : -transaction.amount);

                    const updatedTransactions = newDebt === 0 ? [] : [transaction, ...client.transactions];

                    return {
                        ...client,
                        debt: newDebt,
                        transactions: updatedTransactions
                    };
                }
                return client;
            })
        );
    };

    return (
        <ClientContext.Provider value={{ clients, addClient, getClientById, addTransaction }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = (): ClientContextType => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClientContext must be used within a ClientProvider');
    }
    return context;
};