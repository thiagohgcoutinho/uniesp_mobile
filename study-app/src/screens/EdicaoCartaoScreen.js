import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';

const EdicaoCartaoScreen = ({ route, navigation }) => {
    const { id } = route.params || {};
    const { cartoes, adicionarCartao, atualizarCartao } = useContext(CartoesEstudoContext);
    const cartao = cartoes.find((c) => c.id === id) || {};

    const [titulo, setTitulo] = useState(cartao.titulo || '');
    const [notas, setNotas] = useState(cartao.notas || '');
    const [status, setStatus] = useState(cartao.status || 'backlog');
    const [dataTermino, setDataTermino] = useState(cartao.dataTermino ? new Date(cartao.dataTermino) : new Date());
    const [mostraDateTimePicker, setMostraDateTimePicker] = useState(false);
    const [mostraPickerStatus, setMostraPickerStatus] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState(status);
    const [erros, setErros] = useState({});

    const validarCampos = () => {
        const novosErros = {};
        if (!titulo.trim()) novosErros.titulo = 'O título é obrigatório.';
        if (!notas.trim()) novosErros.notas = 'As notas são obrigatórias.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvar = () => {
        if (!validarCampos()) return;

        const dadosCartao = {
            titulo,
            notas,
            status,
            dataTermino: dataTermino.toISOString(),
        };

        if (id) {
            atualizarCartao(id, dadosCartao);
        } else {
            adicionarCartao(dadosCartao);
        }

        Alert.alert('Sucesso', 'As alterações no cartão foram salvas com sucesso!');
        navigation.goBack();
    };

    const traduzirStatus = (valor) => {
        switch (valor) {
            case 'backlog':
                return 'Backlog';
            case 'in_progress':
                return 'Em Progresso';
            case 'done':
                return 'Concluído';
            default:
                return valor;
        }
    };

    const exibirDateTimePicker = () => setMostraDateTimePicker(true);
    const ocultarDateTimePicker = () => setMostraDateTimePicker(false);
    const confirmarDateTime = (dataHora) => {
        setDataTermino(dataHora);
        ocultarDateTimePicker();
    };

    const confirmarStatus = () => {
        setStatus(statusSelecionado);
        setMostraPickerStatus(false);
    };

    const { width } = Dimensions.get('window');
    const isLargeScreen = width > 600;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.label}>Título:</Text>
                    <TextInput
                        style={[styles.input, erros.titulo && styles.inputErro]}
                        value={titulo}
                        onChangeText={(text) => {
                            setTitulo(text);
                            setErros((prev) => ({ ...prev, titulo: null }));
                        }}
                        placeholder="Título do Cartão..."
                        placeholderTextColor="#aaa"
                    />
                    {erros.titulo && <Text style={styles.mensagemErro}>{erros.titulo}</Text>}

                    <Text style={styles.label}>Notas:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, erros.notas && styles.inputErro]}
                        value={notas}
                        onChangeText={(text) => {
                            setNotas(text);
                            setErros((prev) => ({ ...prev, notas: null }));
                        }}
                        placeholder="Insira uma descrição..."
                        placeholderTextColor="#aaa"
                        multiline
                    />
                    {erros.notas && <Text style={styles.mensagemErro}>{erros.notas}</Text>}

                    <Text style={styles.label}>Data e Hora de Término:</Text>
                    <TouchableOpacity style={styles.button} onPress={exibirDateTimePicker}>
                        <MaterialIcons name="date-range" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>
                            {dataTermino.toLocaleDateString()} às{' '}
                            {dataTermino.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={mostraDateTimePicker}
                        mode="datetime"
                        onConfirm={confirmarDateTime}
                        onCancel={ocultarDateTimePicker}
                        confirmTextIOS="Confirmar"
                        cancelTextIOS="Cancelar"
                        themeVariant="light"
                        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                        style={[isLargeScreen && { alignSelf: 'center' }]}
                    />

                    <Text style={styles.label}>Status:</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setMostraPickerStatus(true)}>
                        <Text style={styles.buttonText}>{traduzirStatus(status)}</Text>
                    </TouchableOpacity>
                    <Modal transparent={true} visible={mostraPickerStatus} animationType="fade">
                        <View style={styles.modal}>
                            <View
                                style={[
                                    styles.modalContent,
                                    isLargeScreen && { width: '50%', alignItems: 'center' },
                                ]}
                            >
                                {['backlog', 'in_progress', 'done'].map((valor) => (
                                    <TouchableOpacity
                                        key={valor}
                                        style={[
                                            styles.modalItem,
                                            statusSelecionado === valor && styles.itemSelecionado,
                                        ]}
                                        onPress={() => setStatusSelecionado(valor)}
                                    >
                                        <Text>{traduzirStatus(valor)}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={styles.buttonConfirmar} onPress={confirmarStatus}>
                                    <Text style={styles.buttonText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity style={styles.saveButton} onPress={salvar}>
                        <MaterialIcons name="save" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderColor: '#ddd',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    inputErro: {
        borderColor: '#e63946',
        borderWidth: 1,
    },
    mensagemErro: {
        color: '#e63946',
        marginBottom: 10,
    },
    textArea: {
        height: 100,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalItem: {
        fontSize: 18,
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        width: '100%',
        textAlign: 'center',
    },
    itemSelecionado: {
        backgroundColor: '#d3d3d3',
    },
    buttonConfirmar: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
});

export default EdicaoCartaoScreen;
