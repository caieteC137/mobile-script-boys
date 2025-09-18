// screens/ListaPontosTuristicos.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import PontoTuristicoCard from '../components/PontoTuristicoCard'; // <-- Caminho corrigido
import api from '../services/api';

const ListaPontosTuristicos = () => {
    const [pontosTuristicos, setPontosTuristicos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPontosTuristicos = async () => {
            try {
                const response = await api.get('/posts');
                const dadosAdaptados = response.data.map(item => ({
                    id: String(item.id),
                    nome: item.title.split(' ').slice(0, 3).join(' '), // Pegando apenas as 3 primeiras palavras para o título
                    descricao: item.body.split('\n')[0], // Pegando apenas a primeira linha da descrição
                    imagem: `https://picsum.photos/id/${item.id % 100}/150/150`, // Imagem fictícia
                }));
                setPontosTuristicos(dadosAdaptados);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError("Não foi possível carregar os pontos turísticos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPontosTuristicos();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Carregando pontos turísticos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Pontos Turísticos (API)</Text>
            <FlatList
                data={pontosTuristicos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    // Passando todas as props necessárias para o Card
                    <PontoTuristicoCard
                        nome={item.nome}
                        descricao={item.descricao}
                        imagem={item.imagem}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe0e0',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default ListaPontosTuristicos;