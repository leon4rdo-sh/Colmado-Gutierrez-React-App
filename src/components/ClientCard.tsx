import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importar el hook de navegación
import { StackNavigationProp } from '@react-navigation/stack'; // Importar el tipo de navegación
import { RootStackParamList } from '../types/RootStackParamList'; // Asegúrate de que el archivo de rutas esté en la ubicación correcta
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Item {
    id: string;
    name: string;
    debt: number;

}

// Definir el tipo de navegación específico para ClientDetailScreen
type ClientDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ClientDetailScreen'>;

export default function ClientCard({ item }: { item: Item }) {
    // Especificar el tipo de navegación
    const navigation = useNavigation<ClientDetailScreenNavigationProp>();

    // Formateo del número como pesos dominicanos
    const formattedDebt = item.debt.toLocaleString('es-DO');

    return (
        <TouchableOpacity onPress={() => navigation.navigate('ClientDetailScreen', { id: item.id })}>
            <View style={styles.clientCard}>
                <View>
                    <Text style={styles.clientName}>{item.name}</Text>
                    <Text style={styles.clientDebt}>Deuda total: ${formattedDebt}</Text>
                </View>
                <View style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Ver detalles</Text>
                    <FontAwesome name="angle-right" size={20} color="#444" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    clientCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    clientDebt: {
        fontSize: 14,
        color: '#777',
    },
    detailsButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
    },
    detailsButtonText: {
        color: '#444',
        fontWeight: "bold",
        marginEnd: 10
    },
});