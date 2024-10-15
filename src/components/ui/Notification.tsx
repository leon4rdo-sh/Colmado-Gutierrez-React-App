// src/components/Notification.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification = ({ message, type, onClose } : NotificationProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Cerrar la notificación después de 3 segundos
        }, 3000);

        return () => clearTimeout(timer); // Limpiar el timer al desmontar
    }, [onClose]);

    return (
        <View style={[styles.notification, type === 'success' ? styles.success : styles.error]}>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    notification: {
        position: 'absolute',
        top: 50,
        left: '5%',
        right: '5%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        zIndex: 1000,
    },
    success: {
        backgroundColor: '#4CAF50', // Color verde
    },
    error: {
        backgroundColor: '#F44336', // Color rojo
    },
    message: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Notification;