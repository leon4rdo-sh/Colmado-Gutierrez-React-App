import React, { useState, useMemo, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import NavBar from '../components/NavBar';
import ClientSumary from '../components/ClientsSumary';
import ClientCard from '../components/ClientCard';
import AddClient from "../components/ui/AddClient";
import { StackNavigationProps } from '../types/RootStackParamList';
import { useClientContext } from '../context/ClientContext';

export default function HomeScreen({ navigation }: StackNavigationProps<'HomeScreen'>) {
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);  // Track search state
    const { clients } = useClientContext();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSearchText('');
            setIsSearching(false);
            Keyboard.dismiss();
        });

        return unsubscribe;
    }, [navigation]);

    // Filtrar y ordenar los clientes
    const filteredAndSortedClients = useMemo(() => {
        return clients
            .filter((client) => (searchText === '' ? client.debt > 0 : client.debt >= 0) && client.name.toLowerCase().includes(searchText.toLowerCase()))
            .sort((a, b) => b.debt - a.debt);
    }, [clients, searchText]);

    // Calcular la deuda total y el número de clientes con deuda
    const { totalDebt, clientsWithDebt } = useMemo(() => {
        return clients.reduce(
            (acc, client) => {
                if (client.debt > 0) {
                    acc.totalDebt += client.debt;
                    acc.clientsWithDebt++;
                }
                return acc;
            },
            { totalDebt: 0, clientsWithDebt: 0 }
        );
    }, [clients]);

    const handleAddClientPress = () => {
        navigation.navigate('AddClientScreen');
    };

    const handleCardPress = (id: string) => {
        setSearchText('');
        setIsSearching(false);
        Keyboard.dismiss();
        navigation.navigate('ClientDetailScreen', { id });
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <NavBar onSearch={setSearchText} isSearching={isSearching} setIsSearching={setIsSearching} />
                <FlatList
                    style={styles.clientsList}
                    data={filteredAndSortedClients}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => handleCardPress(item.id)}>
                            <View>
                                <ClientCard item={item} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        searchText === '' ? (
                            <ClientSumary clientsWithDebt={clientsWithDebt} totalDebt={totalDebt} />
                        ) : null
                    }
                    contentContainerStyle={styles.contentContainer}
                    ListEmptyComponent={<Text style={styles.noResultsText}>No se encontraron clientes con deuda</Text>}
                />
                <AddClient onPress={handleAddClientPress} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    clientsList: {
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingTop: 16,
        paddingBottom: 80,
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});
