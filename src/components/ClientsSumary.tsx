import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Definir la interfaz de las props
interface ClientsSummaryProps {
    totalDebt: number;
    clientsWithDebt: number;
}

// Pasar las props correctamente en el componente
export default function ClientsSummary({ totalDebt, clientsWithDebt }: ClientsSummaryProps) {
    const formattedDebt = totalDebt.toLocaleString('es-DO');

    return (
        <View style={styles.debtSummary}>
            <Text style={styles.debtTotalLabel}>Deuda Total:</Text>
            <Text style={styles.debtTotalAmount}>${formattedDebt}</Text>
            <Text style={styles.clientsWithDebt}>Clientes con Deuda: {clientsWithDebt}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    debtSummary: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        alignItems: 'center',
    },
    debtTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444'
    },
    debtTotalAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#444'
    },
    clientsWithDebt: {
        fontSize: 16,
        color: '#555',
    },
});