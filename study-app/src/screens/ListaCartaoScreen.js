import React, { useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';
import { MaterialIcons } from 'react-native-vector-icons';

const ListaCartaoScreen = ({ navigation }) => {
    const { cartoes, excluirCartao } = useContext(CartoesEstudoContext);

    const renderizarCartao = ({ item }) => {
        const hoje = new Date();
        const dataTermino = new Date(item.dataTermino);
        const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);

        // Define a cor da borda
        let cardStyle = { ...styles.card };
        if (item.status === 'done') {
            cardStyle = { ...cardStyle, ...styles.cardDone };
        } else if (item.status === 'in_progress') {
            if (diferencaDias > 15) {
                cardStyle = { ...cardStyle, ...styles.cardInProgress };
            } else if (diferencaDias <= 15 && diferencaDias > 7) {
                cardStyle = { ...cardStyle, ...styles.cardWarning };
            } else if (diferencaDias <= 7 && diferencaDias >= 0) {
                cardStyle = { ...cardStyle, ...styles.cardAlert };
            }
        } else if (item.status === 'backlog') {
            cardStyle = diferencaDias > 15 ? { ...cardStyle, ...styles.cardBacklog } : { ...cardStyle, ...styles.cardWarning };
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
                <View style={styles.cardHeader}>
                    {/* Ícone de alerta para cartões em backlog com menos de 15 dias */}
                    {item.status === 'backlog' && diferencaDias <= 15 && diferencaDias >= 0 && (
                        <MaterialIcons
                            name="warning"
                            size={18}
                            color="#ffa500"
                            style={styles.alertIcon}
                        />
                    )}
                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                </View>
                <Text style={styles.cardText}>Status: {traduzirStatus(item.status)}</Text>
                <Text style={styles.cardText}>Data: {dataTermino.toLocaleDateString()}</Text>
                {item.notas && <Text style={styles.cardNotes}>{item.notas}</Text>}
                <View style={styles.cardButtons}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EdicaoCartao', { id: item.id })}
                        style={styles.iconButton}
                    >
                        <MaterialIcons name="edit" size={18} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => confirmarExclusao(item.id)}
                        style={styles.iconButton}
                    >
                        <MaterialIcons name="delete" size={18} color="#ff6347" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const confirmarExclusao = (id) => {
        Alert.alert(
            "Excluir Cartão",
            "Tem certeza que deseja excluir este cartão?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => excluirCartao(id), style: "destructive" }
            ]
        );
    };

    const cartoesVencimentoProximo = cartoes.filter(cartao => {
        const dataTermino = new Date(cartao.dataTermino);
        const diferencaDias = (dataTermino - new Date()) / (1000 * 60 * 60 * 24);
        return diferencaDias >= 0 && diferencaDias <= 15;
    });

    return (
        <View style={styles.container}>
            {/* Botão melhorado para "Tarefas a Vencer" */}
            <TouchableOpacity
                style={styles.dueSoonButton}
                onPress={() => navigation.navigate('TarefasVencimentoProximo')}
            >
                <MaterialIcons name="warning" size={20} color="#ffffff" />
                <Text style={styles.dueSoonButtonText}>
                    Tarefas a Vencer: {cartoesVencimentoProximo.length}
                </Text>
            </TouchableOpacity>

            {/* Renderização por status */}
            <Text style={styles.sectionTitle}>Backlog</Text>
            <FlatList
                data={cartoes.filter(cartao => cartao.status === 'backlog')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <Text style={styles.sectionTitle}>Em Progresso</Text>
            <FlatList
                data={cartoes.filter(cartao => cartao.status === 'in_progress')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <Text style={styles.sectionTitle}>Concluído</Text>
            <FlatList
                data={cartoes.filter(cartao => cartao.status === 'done')}
                keyExtractor={(item) => item.id}
                renderItem={renderizarCartao}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('EdicaoCartao')}
            >
                <MaterialIcons name="add" size={24} color="#ffffff" />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4500',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    dueSoonButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    flatListContainer: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginHorizontal: 8,
        borderRadius: 8,
        elevation: 2,
        width: 180,
        justifyContent: 'space-between',
    },
    cardBacklog: {
        borderColor: '#d3d3d3',
        borderWidth: 2,
    },
    cardDone: {
        borderColor: '#32cd32',
        borderWidth: 2,
    },
    cardInProgress: {
        borderColor: '#007bff',
        borderWidth: 2,
    },
    cardWarning: {
        borderColor: '#ffa500',
        borderWidth: 2,
    },
    cardAlert: {
        borderColor: '#ff4500',
        borderWidth: 2,
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    alertIcon: {
        marginRight: 5,
    },
    iconButton: {
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007bff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default ListaCartaoScreen;
