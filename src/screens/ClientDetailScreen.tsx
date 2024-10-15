import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Keyboard } from 'react-native';
import { StackNavigationProps } from '../types/RootStackParamList';
import { useClientContext } from '../context/ClientContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Notification from '../components/ui/Notification';

export default function ClientDetailScreen({ route, navigation }: StackNavigationProps<'ClientDetailScreen'>) {
    const { id } = route.params;
    const { getClientById, addTransaction } = useClientContext();
    const client = getClientById(id);
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState<'Deuda' | 'Abono'>('Deuda');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!client) {
        return (
            <View style={styles.container}>
                <Text>Cliente no encontrado</Text>
            </View>
        );
    }

    // Función para formatear el número con comas
    const formatNumberWithCommas = (value: string) => {
        const cleaned = value.replace(/\D+/g, ''); // Eliminar caracteres que no son dígitos
        const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Insertar comas cada 3 dígitos
        return formatted;
    };

    const formatMoney = (amount: number) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return localDate.toLocaleDateString('es-ES', options).replace(/^\w/, (c) => c.toUpperCase());
    };

    const handleAmountChange = (text: string) => {
        const formattedAmount = formatNumberWithCommas(text);
        setAmount(formattedAmount);
    };

    const handleAddTransaction = () => {
        Keyboard.dismiss();
        const parsedAmount = parseFloat(amount.replace(/,/g, '')); // Convertir el valor formateado a número
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setNotification({ message: 'Por favor, ingrese un monto válido.', type: 'error' });
            return;
        }
        if (transactionType === 'Abono' && parsedAmount > client.debt) {
            setNotification({ message: 'El abono no puede ser mayor a la deuda pendiente.', type: 'error' });
            return;
        }

        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];

        const newTransaction = {
            date: formattedDate,
            amount: parsedAmount,
            type: transactionType
        };

        addTransaction(client.id, newTransaction);
        setAmount('');
        setNotification({ message: 'Transacción agregada correctamente.', type: 'success' });
    };

    return (
        <View style={styles.main}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <View style={styles.header}>
                <TouchableOpacity style={styles.goBack} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#333" />
                    <Text style={styles.goBackText}>Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Colmado Gutierrez</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientDebt}>Deuda total: ${formatMoney(client.debt)}</Text>
                    {client.phone && <Text style={styles.clientPhone}>Teléfono: {client.phone}</Text>}
                </View>
                <View style={styles.transactionForm}>
                    <TextInput
                        style={styles.input}
                        placeholder="Monto"
                        value={amount}
                        onChangeText={handleAmountChange}
                        keyboardType="number-pad"
                    />
                    <View style={styles.transactionTypeButtons}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                transactionType === 'Deuda' && styles.activeDeudaButton
                            ]}
                            onPress={() => setTransactionType('Deuda')}
                        >
                            <Text style={[styles.typeButtonText, transactionType === 'Deuda' && styles.activeTypeButtonText]}>Deuda</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                transactionType === 'Abono' && styles.activeAbonoButton
                            ]}
                            onPress={() => setTransactionType('Abono')}
                        >
                            <Text style={[styles.typeButtonText, transactionType === 'Abono' && styles.activeTypeButtonText]}>Abono</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addTransactionButton} onPress={handleAddTransaction}>
                        <Text style={styles.addTransactionButtonText}>Agregar Transacción</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.transactionHistory}>
                    <Text style={styles.transactionTitle}>Historial de Transacciones</Text>
                    <FlatList
                        data={client.transactions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.transactionCard}>
                                <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
                                <Text
                                    style={[
                                        styles.transactionAmount,
                                        item.type === 'Abono' ? styles.abonoAmount : styles.deudaAmount
                                    ]}
                                >
                                    Monto: ${formatMoney(item.amount)}
                                </Text>
                                <Text style={styles.transactionType}>Tipo: {item.type}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noResultsText}>No hay transacciones para mostrar. Si el cliente salda su deuda completa, el historial se reiniciará para ahorrar espacio en el dispositivo.</Text>}
                    />
                </View>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    main: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 16,
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#ddd',
        position: 'static',
        zIndex: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#444',
    },
    goBack: {
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        color: '#333'
    },
    goBackText: {
        fontSize: 18,
        marginHorizontal: 5,
        color: '#555',
        fontWeight: 'bold'
    },
    clientInfo: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    clientName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    clientDebt: {
        fontSize: 18,
        marginTop: 10,
        color: '#555',
    },
    clientPhone: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    transactionForm: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    transactionTypeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 10
    },
    typeButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    activeDeudaButton: {
        backgroundColor: '#FF6B6B',
    },
    activeAbonoButton: {
        backgroundColor: '#4CAF50',
    },
    typeButtonText: {
        color: '#000',
        fontWeight: 'bold'
    },
    activeTypeButtonText: {
        color: '#fff',
    },
    addTransactionButton: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addTransactionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    transactionHistory: {
        flex:1,
    },
    transactionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    transactionCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    transactionDate: {
        fontSize: 14,
        color: '#333',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deudaAmount: {
        color: '#FF6B6B',
    },
    abonoAmount: {
        color: '#4CAF50',
    },
    transactionType: {
        fontSize: 14,
        color: '#555',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});