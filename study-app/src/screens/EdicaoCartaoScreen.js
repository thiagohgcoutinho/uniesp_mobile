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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from 'react-native-vector-icons';
import CartoesEstudoContext from '../contexts/CartoesEstudoContext';

const EdicaoCartaoScreen = ({ route, navigation }) => {
    const { id } = route.params || {};
    const { cartoes, adicionarCartao, atualizarCartao } = useContext(CartoesEstudoContext);
    const cartao = cartoes.find(c => c.id === id) || {};

    const [titulo, setTitulo] = useState(cartao.titulo || '');
    const [notas, setNotas] = useState(cartao.notas || '');
    const [status, setStatus] = useState(cartao.status || 'backlog');
    const [dataTermino, setDataTermino] = useState(cartao.dataTermino ? new Date(cartao.dataTermino) : new Date());
    const [mostraDateTimePicker, setMostraDateTimePicker] = useState(false);
    const [mostraPickerStatus, setMostraPickerStatus] = useState(false);

    const salvar = () => {
        const dadosCartao = {
            titulo,
            notas,
            status,
            dataTermino: dataTermino.toISOString()
        };

        if (id) {
            atualizarCartao(id, dadosCartao);
        } else {
            adicionarCartao(dadosCartao);
        }

        // Exibir mensagem de confirmação
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.label}>Título:</Text>
                    <TextInput
                        style={styles.input}
                        value={titulo}
                        onChangeText={setTitulo}
                        placeholder="Título do Cartão..."
                        placeholderTextColor="#aaa"
                    />

                    <Text style={styles.label}>Notas:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={notas}
                        onChangeText={setNotas}
                        placeholder="Insira uma descrição..."
                        placeholderTextColor="#aaa"
                        multiline
                    />

                    <Text style={styles.label}>Data e Hora de Término:</Text>
                    <TouchableOpacity style={styles.button} onPress={exibirDateTimePicker}>
                        <MaterialIcons name="date-range" size={20} color="#ffffff" />
                        <Text style={styles.buttonText}>Escolher Data e Hora</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={mostraDateTimePicker}
                        mode="datetime"
                        onConfirm={confirmarDateTime}
                        onCancel={ocultarDateTimePicker}
                        themeVariant="light"
                        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                    />
                    <Text style={styles.selectedDateLabel}>
                        Data selecionada: {dataTermino.toLocaleDateString()} às {dataTermino.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>

                    <Text style={styles.label}>Status:</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.picker]}
                        onPress={() => setMostraPickerStatus(true)}
                    >
                        <Text>{traduzirStatus(status)}</Text>
                    </TouchableOpacity>
                    {mostraPickerStatus && (
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => {
                                setStatus(itemValue);
                                setMostraPickerStatus(false);
                            }}
                        >
                            <Picker.Item label="Backlog" value="backlog" />
                            <Picker.Item label="Em Progresso" value="in_progress" />
                            <Picker.Item label="Concluído" value="done" />
                        </Picker>
                    )}

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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textArea: {
        height: 100,
    },
    picker: {
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    selectedDateLabel: {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
    },
});

export default EdicaoCartaoScreen;
