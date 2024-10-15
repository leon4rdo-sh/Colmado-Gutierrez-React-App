import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Definimos las rutas de la app
export type RootStackParamList = {
    HomeScreen: undefined;
    AddClientScreen: undefined;
    ClientDetailScreen: { id: string };  // Aquí se agrega el parámetro id
};

// Tipo para navegación en cualquier pantalla del stack
export type StackNavigationProps<RouteName extends keyof RootStackParamList> = {
    navigation: StackNavigationProp<RootStackParamList, RouteName>;
    route: RouteProp<RootStackParamList, RouteName>;
};