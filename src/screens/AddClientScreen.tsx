import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProps } from '../types/RootStackParamList';
import { useClientContext } from '../context/ClientContext';
import Notification from '../components/ui/Notification';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddClientScreen({ navigation }: StackNavigationProps<'AddClientScreen'>) {
    const [name, setName] = useState("");
    const [debt, setDebt] = useState("");
    const [phone, setPhone] = useState("");
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const { addClient, clients } = useClientContext();

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        return phoneRegex.test(phone);
    };

    const formatName = (name: string) => {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Función para formatear el número con comas
    const formatNumberWithCommas = (value: string) => {
        const cleaned = value.replace(/\D+/g, ''); // Eliminar cualquier carácter que no sea un dígito
        const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Insertar comas cada 3 dígitos
        return formatted;
    };

    const handleDebtChange = (text: string) => {
        const formattedDebt = formatNumberWithCommas(text);
        setDebt(formattedDebt);
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D+/g, "");
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

        if (match) {
            let formatted = match[1];
            if (match[2]) formatted += `-${match[2]}`;
            if (match[3]) formatted += `-${match[3]}`;
            return formatted;
        }
        return value;
    };

    const handleAddClient = () => {
        if (name.trim() === "") {
            setNotification({ message: "El nombre es obligatorio", type: 'error' });
            return;
        }

        if (name.trim().length < 3) {
            setNotification({ message: "El nombre debe tener al menos 3 caracteres", type: 'error' });
            return;
        }

        const parsedDebt = parseFloat(debt.replace(/,/g, '')); // Eliminar comas para convertir el número
        if (debt !== "" && (isNaN(parsedDebt) || parsedDebt < 0)) {
            setNotification({ message: "La deuda debe ser un número válido y no negativo", type: 'error' });
            return;
        }

        if (phone !== "" && !isValidPhoneNumber(phone)) {
            setNotification({ message: "El número de teléfono debe estar en el formato 000-000-0000", type: 'error' });
            return;
        }

        const formattedName = formatName(name);

        // Validación: Verificar si ya existe un cliente con el mismo nombre en el contexto de clientes
        const clientExists = clients.some(client => client.name.toLowerCase() === formattedName.toLowerCase());

        if (clientExists) {
            setNotification({ message: "No se pueden agregar dos clientes con el mismo nombre", type: 'error' });
            return;
        }

        const newClient = {
            name: formattedName,
            debt: parsedDebt || 0,
            phone,
        };

        addClient(newClient);

        setNotification({ message: "Cliente agregado con éxito", type: 'success' });
        setName("");
        setDebt("");
        setPhone("");
    };

    return (
        <View style={styles.container}>
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

            <View style={styles.containerForm}>
                <View style={styles.formContainer}>
                    <Text style={styles.newClientTitle}>Nuevo Cliente</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre:"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Deuda Inicial: (Opcional)"
                        value={debt}
                        onChangeText={handleDebtChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Número de Teléfono: (Opcional)"
                        value={phone}
                        onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                        keyboardType="phone-pad"
                        maxLength={12}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddClient}>
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    newClientTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#444',
        marginBottom: 30,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#444',
    },
    containerForm: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
