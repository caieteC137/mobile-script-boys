import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native'; // <--- Importe ScrollView
import PontoTuristicoCard from './components/pontoTuristicoCard'; // <--- Importe o componente



export default function App() {
  return (

    <ScrollView style={styles.scrollViewContainer}> {/* <--- Usando ScrollView */}
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Conheça Curitiba!</Text> {/* <--- Título principal */}

        <PontoTuristicoCard
          nome="Jardim Botânico"
          descricao="Um dos mais famosos cartões-postais da cidade."
        />

        <PontoTuristicoCard
          nome="Ópera de Arame"
          descricao="Teatro com estrutura tubular e teto transparente, em meio à natureza."
        />

        <PontoTuristicoCard
          nome="Parque Tanguá"
          descricao="Antiga pedreira transformada em parque com cascata e mirante."
        />

        <PontoTuristicoCard
          nome="Museu Oscar Niemeyer"
          descricao="Conhecido como Museu do Olho, com arte moderna e contemporânea."
        />

        <StatusBar style="auto" />

      </View>

    </ScrollView>,

    /* Exemplo de Flexbox para demonstração */

    <View style={styles.flexboxExample}>

      <View style={styles.box}><Text>1</Text></View>

      <View style={[styles.box, { backgroundColor: 'orange' }]}><Text>2</Text></View>

      <View style={styles.box}><Text>3</Text></View>

    </View>
  );
}

// No StyleSheet.create, adicione:

const styles = StyleSheet.create({

  // ... estilos existentes ...

  flexboxExample: {

    flexDirection: 'row', // <--- Itens lado a lado (por padrão é 'column')

    justifyContent: 'space-around', // <--- Espaça itens uniformemente

    alignItems: 'center', // <--- Centraliza itens verticalmente

    backgroundColor: '#e0e0e0',

    padding: 10,

    margin: 20,

    borderRadius: 8,

  },

  box: {

    width: 50,

    height: 50,

    backgroundColor: 'lightblue',

    justifyContent: 'center',

    alignItems: 'center',

    margin: 5,

    borderRadius: 5,

  }

});

