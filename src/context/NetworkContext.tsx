import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';
import { transactionService } from '../services/transaction';
import * as loanService from '../services/loan';

interface PendingAction {
    id: string;
    type: 'transaction' | 'loan';
    action: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
}

interface NetworkContextType {
    isOnline: boolean;
    isInternetReachable: boolean;
    pendingActions: PendingAction[];
    lastSyncTimestamp: number | null;
    addPendingAction: (action: Omit<PendingAction, 'id' | 'timestamp'>) => void;
    removePendingAction: (id: string) => void;
    syncPendingActions: () => Promise<void>;
    clearPendingActions: () => void;
    updateLastSyncTimestamp: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const PENDING_ACTIONS_KEY = 'pending_actions';
const LAST_SYNC_KEY = 'last_sync_timestamp';

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isInternetReachable, setIsInternetReachable] = useState(true);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
    const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load pending actions and last sync from storage on mount
    useEffect(() => {
        (async () => {
            const storedActions = await loadFromStorage(PENDING_ACTIONS_KEY);
            if (storedActions) {
                setPendingActions(storedActions);
            }

            const storedSync = await loadFromStorage(LAST_SYNC_KEY);
            if (storedSync) {
                setLastSyncTimestamp(storedSync);
            }
        })();
    }, []);

    // Save pending actions whenever they change
    useEffect(() => {
        saveToStorage(PENDING_ACTIONS_KEY, pendingActions);
    }, [pendingActions]);

    // Listen for network changes
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const wasOffline = !isOnline;
            setIsOnline(state.isConnected ?? false);
            setIsInternetReachable(state.isInternetReachable ?? false);

            // Auto-sync when coming back online
            if (wasOffline && state.isConnected && pendingActions.length > 0) {
                syncPendingActions();
            }
        });

        return () => unsubscribe();
    }, [isOnline, pendingActions.length]);

    const addPendingAction = useCallback((action: Omit<PendingAction, 'id' | 'timestamp'>) => {
        const newAction: PendingAction = {
            ...action,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        };
        setPendingActions(prev => [...prev, newAction]);
    }, []);

    const removePendingAction = useCallback((id: string) => {
        setPendingActions(prev => prev.filter(a => a.id !== id));
    }, []);

    const updateLastSyncTimestamp = useCallback(() => {
        const now = Date.now();
        setLastSyncTimestamp(now);
        saveToStorage(LAST_SYNC_KEY, now);
    }, []);

    const syncPendingActions = useCallback(async () => {
        if (isSyncing || pendingActions.length === 0 || !isOnline) {
            return;
        }

        setIsSyncing(true);
        const actionsToSync = [...pendingActions];

        for (const action of actionsToSync) {
            try {
                switch (action.type) {
                    case 'transaction':
                        switch (action.action) {
                            case 'create':
                                await transactionService.createTransaction(action.data);
                                break;
                            case 'update':
                                await transactionService.updateTransaction(action.data);
                                break;
                            case 'delete':
                                await transactionService.deleteTransaction(action.data.id);
                                break;
                        }
                        break;
                    case 'loan':
                        switch (action.action) {
                            case 'create':
                                await loanService.createLoan(action.data);
                                break;
                            case 'update':
                                await loanService.updateLoanStatus(action.data.id, action.data.status);
                                break;
                            case 'delete':
                                await loanService.deleteLoan(action.data.id);
                                break;
                        }
                        break;
                }

                // Remove successful action
                removePendingAction(action.id);
            } catch (error) {
                console.error(`Failed to sync action ${action.id}:`, error);
            }
        }

        if (actionsToSync.length > 0) {
            updateLastSyncTimestamp();
        }

        setIsSyncing(false);
    }, [isSyncing, pendingActions, isOnline, removePendingAction, updateLastSyncTimestamp]);

    const clearPendingActions = useCallback(() => {
        setPendingActions([]);
    }, []);

    return (
        <NetworkContext.Provider
            value={{
                isOnline,
                isInternetReachable,
                pendingActions,
                lastSyncTimestamp,
                addPendingAction,
                removePendingAction,
                syncPendingActions,
                clearPendingActions,
                updateLastSyncTimestamp,
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
}
