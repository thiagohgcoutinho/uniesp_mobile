import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const RegistroScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            navigation.goBack(); // Retorna à tela de login
        } catch (error) {
            const errorMessage = error.message.includes('auth/email-already-in-use')
                ? 'O email já está em uso. Tente outro.'
                : error.message.includes('auth/weak-password')
                ? 'A senha deve ter pelo menos 6 caracteres.'
                : 'Erro ao criar conta. Tente novamente mais tarde.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Criar Conta</Text>

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            style={styles.inputPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.passwordToggle}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialIcons
                                name={showPassword ? 'visibility' : 'visibility-off'}
                                size={20}
                                color="#6c757d"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Registrar</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#343a40',
    },
    input: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#ffffff',
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    inputPassword: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    passwordToggle: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default RegistroScreen;
