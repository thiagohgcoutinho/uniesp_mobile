import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, TouchableOpacity } from 'react-native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import { ProvedorCartoesEstudo } from './src/contexts/CartoesEstudoContext';
import ListaCartaoScreen from './src/screens/ListaCartaoScreen';
import EdicaoCartaoScreen from './src/screens/EdicaoCartaoScreen';
import TarefasVencimentoProximoScreen from './src/screens/TarefasVencimentoProximoScreen';
import ConfiguracaoPerfilScreen from './src/screens/ConfiguracaoPerfilScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading, logout } = useContext(AuthContext);

    if (loading) {
        return null;
    }

    const confirmarLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza de que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    onPress: logout,
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <Stack.Navigator initialRouteName={user ? 'ListaCartao' : 'Login'}>
            {user ? (
                <>
                    <Stack.Screen 
                        name="ListaCartao" 
                        component={ListaCartaoScreen} 
                        options={({ navigation }) => ({
                            title: 'Cartões de Estudo',
                            headerLeft: () => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ConfiguracaoPerfil')}
                                    style={{ marginLeft: 15 }}
                                >
                                    <MaterialIcons name="settings" size={24} color="#007bff" />
                                </TouchableOpacity>
                            ),
                            headerRight: () => (
                                <TouchableOpacity onPress={confirmarLogout} style={{ marginRight: 15 }}>
                                    <MaterialIcons name="logout" size={24} color="#ff6347" />
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Stack.Screen 
                        name="EdicaoCartao" 
                        component={EdicaoCartaoScreen} 
                        options={{ title: 'Editar Cartão' }} 
                    />
                    <Stack.Screen 
                        name="TarefasVencimentoProximo" 
                        component={TarefasVencimentoProximoScreen} 
                        options={{ title: 'Tarefas a Vencer' }} 
                    />
                    <Stack.Screen 
                        name="ConfiguracaoPerfil" 
                        component={ConfiguracaoPerfilScreen} 
                        options={{ title: 'Configurações do Perfil' }} 
                    />
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
                        options={{ title: 'Login' }} 
                    />
                    <Stack.Screen 
                        name="Registro" 
                        component={RegistroScreen} 
                        options={{ title: 'Criar Conta' }} 
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <ProvedorCartoesEstudo>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </ProvedorCartoesEstudo>
        </AuthProvider>
    );
};

export default App;
