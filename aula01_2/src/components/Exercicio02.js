import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import React from 'react';

const Exercicio02 = () => {

    const [contador, setContador] = useState(0);

    const incrementar = () => {
        setContador(contador + 1);
    }

    const decrementar = () => {
        setContador(contador - 1);
    }

    return (
        <View style={styles.container}>
            <Text>O contador está em: {contador}</Text>

            <TouchableOpacity style={styles.button} onPress={incrementar}>
                <Text style={styles.buttonText}>Incrementar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={decrementar}>
                <Text style={styles.buttonText}>Decrementar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 100,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#841584',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Exercicio02;