import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import HomeScreen from './src/screens/HomeScreen';
import React from 'react';
import { createStackNavigator,  StackCardStyleInterpolator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AddClientScreen from './src/screens/AddClientScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import { RootStackParamList } from './src/types/RootStackParamList';
import { ClientProvider } from './src/context/ClientContext';
import { Easing } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const pushFromRight: StackCardStyleInterpolator = ({ current, next, layouts: { screen } }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.width, 0],
            extrapolate: 'clamp',
          }),
        },
        {
          translateX: next
            ? next.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -screen.width],
              extrapolate: 'clamp',
            })
            : 0,
        },
      ],
    },
  };
};


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ClientProvider>
        <StatusBar style="dark" backgroundColor='#fff' />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: pushFromRight, 
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 400,
                    easing: Easing.out(Easing.ease), 
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                  },
                },
              },
            }}
          >
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="AddClientScreen"
              component={AddClientScreen}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="ClientDetailScreen"
              component={ClientDetailScreen}
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ClientProvider>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: Constants.statusBarHeight,
  },
});
