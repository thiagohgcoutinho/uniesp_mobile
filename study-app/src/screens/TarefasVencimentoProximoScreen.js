import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';
import { MaterialIcons } from 'react-native-vector-icons';

const TarefasVencimentoProximoScreen = () => {
    const { cartoes, atualizarCartao } = useContext(CartoesEstudoContext);

    const hoje = new Date();
    const cartoesVencimentoProximo = cartoes.filter(cartao => {
        const dataTermino = new Date(cartao.dataTermino);
        const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);
        return (
            diferencaDias >= 0 &&
            diferencaDias <= 15 &&
            (cartao.status === 'backlog' || cartao.status === 'in_progress')
        );
    });

    const traduzirStatus = (status) => {
        switch (status) {
            case 'backlog':
                return 'Backlog';
            case 'in_progress':
                return 'Em Progresso';
            case 'done':
                return 'Concluído';
            default:
                return status;
        }
    };

    const marcarComoConcluido = (cartao) => {
        Alert.alert(
            'Confirmar',
            `Tem certeza que deseja marcar o cartão "${cartao.titulo}" como concluído?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () =>
                        atualizarCartao(cartao.id, { ...cartao, status: 'done' }),
                },
            ]
        );
    };

    const marcarComoEmProgresso = (cartao) => {
        atualizarCartao(cartao.id, { ...cartao, status: 'in_progress' });
    };

    const renderizarCartao = ({ item }) => {
        const dataTermino = new Date(item.dataTermino);
        const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);

        // Define a cor da borda com base na urgência
        let cardStyle = { ...styles.card };
        if (diferencaDias <= 7) {
            cardStyle = { ...cardStyle, ...styles.cardUrgent };
        } else if (diferencaDias <= 15) {
            cardStyle = { ...cardStyle, ...styles.cardWarning };
        }

        return (
            <View style={cardStyle}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text>Status: {traduzirStatus(item.status)}</Text>
                <Text>Data/Hora de Término: {dataTermino.toLocaleString()}</Text>
                {item.notas && <Text style={styles.cardNotes}>Notas: {item.notas}</Text>}

                {item.status === 'in_progress' && (
                    <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => marcarComoConcluido(item)}
                    >
                        <MaterialIcons name="check-circle" size={20} color="#32cd32" />
                        <Text style={styles.completeButtonText}>Marcar como Concluído</Text>
                    </TouchableOpacity>
                )}

                {item.status === 'backlog' && (
                    <TouchableOpacity
                        style={styles.inProgressButton}
                        onPress={() => marcarComoEmProgresso(item)}
                    >
                        <MaterialIcons name="play-circle" size={20} color="#007bff" />
                        <Text style={styles.inProgressButtonText}>
                            Marcar como Em Progresso
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Tarefas a Vencer ({cartoesVencimentoProximo.length})
            </Text>
            <FlatList
                data={cartoesVencimentoProximo}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarCartao}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        margin: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardWarning: {
        borderColor: '#ffa500',
        borderWidth: 2,
    },
    cardUrgent: {
        borderColor: '#ff4500',
        borderWidth: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardNotes: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    completeButtonText: {
        fontSize: 14,
        color: '#32cd32',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    inProgressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    inProgressButtonText: {
        fontSize: 14,
        color: '#007bff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
});

export default TarefasVencimentoProximoScreen;
