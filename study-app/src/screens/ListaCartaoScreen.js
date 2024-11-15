import React, { useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';
import { MaterialIcons } from 'react-native-vector-icons';

const ListaCartaoScreen = ({ navigation }) => {
    const { cartoes, excluirCartao } = useContext(CartoesEstudoContext);

    const confirmarExclusao = (id) => {
        Alert.alert("Excluir Cartão", "Tem certeza que deseja excluir este cartão?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", onPress: () => excluirCartao(id), style: "destructive" }
        ]);
    };

    const renderizarCartao = ({ item }) => {
        let cardStyle = styles.card;
        if (item.status === 'backlog') {
            cardStyle = { ...styles.card, ...styles.cardBacklog };
        } else if (item.status === 'done') {
            cardStyle = { ...styles.card, ...styles.cardDone };
        } else if (item.status === 'in_progress') {
            cardStyle = { ...styles.card, ...styles.cardInProgress };
        }

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

        return (
            <View style={cardStyle}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardText}>Status: {traduzirStatus(item.status)}</Text>
                <Text style={styles.cardText}>Data: {new Date(item.dataTermino).toLocaleDateString()}</Text>
                {item.notas ? <Text style={styles.cardNotes}>{item.notas}</Text> : null}
                <View style={styles.cardButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('EdicaoCartao', { id: item.id })} style={styles.iconButton}>
                        <MaterialIcons name="edit" size={18} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmarExclusao(item.id)} style={styles.iconButton}>
                        <MaterialIcons name="delete" size={18} color="#ff6347" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const cartoesAgrupadosPorStatus = (status) => cartoes.filter(cartao => cartao.status === status);

    // Filtra os cartões próximos ao vencimento (15 dias)
    const cartoesVencimentoProximo = cartoes.filter(cartao => {
        const dataTermino = new Date(cartao.dataTermino);
        const diferencaDias = (dataTermino - new Date()) / (1000 * 60 * 60 * 24);
        return diferencaDias >= 0 && diferencaDias <= 15;
    });

    return (
        <View style={styles.container}>
            {/* Botão para ver tarefas próximas ao vencimento */}
            <TouchableOpacity style={styles.dueSoonButton} onPress={() => navigation.navigate('TarefasVencimentoProximo')}>
                <Text style={styles.dueSoonButtonText}>Tarefas a Vencer: {cartoesVencimentoProximo.length}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Em Progresso</Text>
            <FlatList
                data={cartoesAgrupadosPorStatus('in_progress')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Concluído</Text>
            <FlatList
                data={cartoesAgrupadosPorStatus('done')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Backlog</Text>
            <FlatList
                data={cartoesAgrupadosPorStatus('backlog')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EdicaoCartao')}>
                <MaterialIcons name="add" size={24} color="#ffffff" />
                <Text style={styles.addButtonText}>Adicionar Novo Cartão</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f7f7f7',
    },
    dueSoonButton: {
        backgroundColor: '#ff4500',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    dueSoonButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    flatListContainer: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        width: 160,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    cardBacklog: {
        borderColor: '#ddd',
    },
    cardDone: {
        borderColor: '#32cd32',
    },
    cardInProgress: {
        borderColor: '#007bff',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    cardText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },
    cardNotes: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    cardButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    addButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 8,
    },
    divider: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        marginVertical: 8,
    },
});

export default ListaCartaoScreen;
