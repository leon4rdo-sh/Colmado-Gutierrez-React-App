import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const NavBar = ({ onSearch, isSearching, setIsSearching }: { onSearch: (text: string) => void, isSearching: boolean, setIsSearching: (isSearching: boolean) => void }) => {
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSearchText('');
            onSearch('');  // Limpiar la búsqueda
            setIsSearching(false);
        });
        return unsubscribe;
    }, [navigation]);

    const handleSearchToggle = () => {
        if (isSearching) {
            setSearchText('');
            onSearch('');  // Limpiar la búsqueda
        }
        setIsSearching(!isSearching);
        if (!isSearching) {
            setTimeout(() => inputRef.current?.focus(), 100);  // Focar el input si está activando la búsqueda
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        onSearch(text);  // Pasar el texto de búsqueda al componente padre
    };

    return (
        <View style={styles.navBar}>
            {!isSearching ? (
                <Text style={styles.text}>Colmado Gutierrez</Text>
            ) : (
                <TextInput
                    ref={inputRef}
                    value={searchText}
                    style={styles.searchInput}
                    placeholder="Buscar cliente..."
                    returnKeyType="search"
                    onSubmitEditing={() => console.log('Buscar')}
                    onChangeText={handleSearchChange}
                />
            )}
            <TouchableOpacity onPress={handleSearchToggle}>
                <Icon
                    name={isSearching ? "close" : "search"}
                    size={30}
                    color="#555"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
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
    },
    text: {
        color: '#444',
        fontSize: 25,
        fontWeight: 'bold'
    },
    searchInput: {
        borderBottomWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        fontSize: 18,
        flex: 1,
        height: 40,
        marginRight: 10,
        padding: 5,
        paddingHorizontal: 16
    }
});

export default NavBar;
