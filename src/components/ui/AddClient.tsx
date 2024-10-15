// src/components/ui/AddClient.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddClientProps {
    onPress: () => void; // Define la prop onPress
}

const AddClient = ({ onPress }: AddClientProps) => {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPress}>
            <Text style={styles.fabText}>Agregar Cliente</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: 16,
        backgroundColor: '#222',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AddClient;