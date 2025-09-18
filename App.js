// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Importa o componente de tela que busca os dados da API
import ListaPontosTuristicos from './screens/ListaPontosTuristicos';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Renderiza o componente que faz o carregamento e exibe a lista */}
      <ListaPontosTuristicos />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
