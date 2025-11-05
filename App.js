// App.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MuseumDetailsScreen from './screens/MuseumDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            initialParams={{ onLogin: handleLogin }}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              initialParams={{ onLogout: handleLogout }}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="MuseumDetails" 
              component={MuseumDetailsScreen}
              options={({ route }) => ({
                title: route.params?.museum?.name || 'Detalhes do Museu',
                headerStyle: {
                  backgroundColor: '#F5F0E8',
                },
                headerTintColor: '#333',
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
});
