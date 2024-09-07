import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import React from 'react';

const Exercicio05 = () => {
    const [tarefa, setTarefa] = useState('');
    const [listaDeTarefas, setListaDeTarefas] = useState([]);

    const adicionarTarefa = () => {
        if (tarefa) {
            setListaDeTarefas([...listaDeTarefas, tarefa]);
            setTarefa('');
        }
    };

    return (
        <View style={styles.container}>
            {/* Campo de entrada de tarefa */}
            <TextInput
                value={tarefa}
                onChangeText={setTarefa}
                placeholder="Digite uma tarefa..."
                style={styles.input}
            />

            {/* Botão para adicionar tarefa */}
            <TouchableOpacity onPress={adicionarTarefa} style={styles.button}>
                <Text style={styles.buttonText}>Adicionar Tarefa</Text>
            </TouchableOpacity>

            {/* Lista de tarefas */}
            <FlatList
                data={listaDeTarefas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text>{item}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 100,
    },
    input: {
        borderWidth: 1,
        padding: 5,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#D3D3D3',  // Cor cinza clara
        padding: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'black',
    },
});

export default Exercicio05;
