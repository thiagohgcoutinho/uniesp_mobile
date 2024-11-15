import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';

const TarefasVencimentoProximoScreen = () => {
    const { cartoes } = useContext(CartoesEstudoContext);

    const hoje = new Date();
    const cartoesVencimentoProximo = cartoes.filter(cartao => {
        const dataTermino = new Date(cartao.dataTermino);
        const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);
        return diferencaDias >= 0 && diferencaDias <= 15;
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

    const renderizarCartao = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text>Status: {traduzirStatus(item.status)}</Text>
            <Text>Data/Hora de Término: {new Date(item.dataTermino).toLocaleString()}</Text>
            {item.notas ? <Text style={styles.cardNotes}>Notas: {item.notas}</Text> : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tarefas a Vencer nos Próximos 15 Dias</Text>
            <FlatList
                data={cartoesVencimentoProximo}
                keyExtractor={item => item.id.toString()}
                renderItem={renderizarCartao}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f7f7f7', // Fundo da tela em cinza claro
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#ffffff', // Fundo do cartão em branco
        padding: 15,
        margin: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
    }
});

export default TarefasVencimentoProximoScreen;
