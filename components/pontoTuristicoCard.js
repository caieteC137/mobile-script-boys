// components/PontoTuristicoCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PontoTuristicoCard = ({ nome, descricao, imagem }) => {
    return (
        <View style={styles.cardContainer}>
            <Image source={{ uri: imagem }} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{nome}</Text>
                <Text style={styles.cardDescription}>{descricao}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        marginHorizontal: 16,
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        flexDirection: 'row',
    },
    cardImage: {
        width: 100,
        height: 100,
    },
    cardTextContainer: {
        flex: 1,
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default PontoTuristicoCard;