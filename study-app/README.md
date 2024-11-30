# Study App

## 📚 Introdução
O **Study App** é um aplicativo para gerenciamento de cartões de estudo, desenvolvido em React Native. Ele utiliza o Firebase para autenticação e armazenamento de dados, proporcionando uma experiência intuitiva e eficiente para os usuários organizarem suas tarefas e metas de estudo.

---

## 🛠 Requisitos
Para executar o projeto, você precisará das seguintes ferramentas instaladas:
- Node.js
- Expo CLI
- Um editor de código (recomendado: Visual Studio Code)
- Um dispositivo ou emulador para testar (Android/iOS)

---

## 📂 Estrutura de Pastas
Abaixo está a explicação da arquitetura do projeto:

study-app ├── assets/ # Imagens e ícones utilizados no app ├── src/ # Código-fonte principal │ ├── config/ # Configuração do Firebase │ ├── contexts/ # Contextos para gerenciamento de estado │ ├── screens/ # Telas do aplicativo ├── .env # Variáveis de ambiente sensíveis ├── app.json # Configurações do aplicativo Expo ├── package.json # Dependências e scripts do projeto ├── eas.json # Configurações do EAS (Expo Application Services) └── App.js # Arquivo principal do aplicativo


---

## 📁 Detalhes dos Arquivos
### **Configuração**
- **`src/config/firebaseConfig.js`**
  - Configura e inicializa o Firebase utilizando as variáveis de ambiente.
  - Exporta as instâncias `auth` (autenticação) e `db` (Firestore) para serem utilizadas em todo o aplicativo.

### **Contextos**
- **`AuthContext.js`**
  - Gerencia o estado de autenticação do usuário.
  - Monitora o login/logout com Firebase Authentication.
  - Fornece os dados do usuário autenticado e funções como `logout`.

- **`CartoesEstudoContext.js`**
  - Gerencia os cartões de estudo armazenados no Firestore.
  - Oferece funcionalidades como adicionar, editar, excluir e listar cartões.
  - Filtra os cartões pelo UID do usuário autenticado.

### **Telas**
1. **`ListaCartaoScreen.js`**
   - Exibe os cartões agrupados por status: Backlog, Em Progresso, Concluído.
   - Destaque para tarefas próximas ao vencimento (nos próximos 15 dias).
   - Permite navegar para edição ou criação de cartões.

2. **`EdicaoCartaoScreen.js`**
   - Tela para criar ou editar um cartão.
   - Campos para título, notas, data de término e status.
   - Utiliza um seletor de data e hora e opções de status.

3. **`LoginScreen.js`**
   - Tela para autenticar o usuário com email e senha.
   - Navegação para a tela de registro em caso de novo usuário.

4. **`RegistroScreen.js`**
   - Tela para criar um novo usuário no Firebase Authentication.
   - Após o registro, redireciona para a tela de login.

5. **`TarefasVencimentoProximoScreen.js`**
   - Exibe uma lista de tarefas com vencimento nos próximos 15 dias.
   - Inclui informações detalhadas como título, status e data/hora de término.

---

## 🧰 Bibliotecas Utilizadas
O projeto utiliza as seguintes bibliotecas:
- **`firebase`**: Integração com Firebase Authentication e Firestore.
- **`react-native`**: Framework principal para desenvolvimento do app.
- **`@react-navigation/native`** e **`@react-navigation/stack`**: Gerenciamento de navegação entre telas.
- **`react-native-modal-datetime-picker`**: Seleção de data e hora.
- **`@react-native-picker/picker`**: Seletor para opções (como status do cartão).
- **`react-native-vector-icons`**: Ícones para uma interface visual atrativa.
- **`react-native-dotenv`**: Gerenciamento de variáveis de ambiente.

---

## 🔒 Variáveis de Ambiente
As configurações sensíveis estão armazenadas no arquivo `.env`:
```env
FIREBASE_api_key=<sua-chave-api>
FIREBASE_AUTH_DOMAIN=<seu-domínio-auth>
FIREBASE_PROJECT_ID=<seu-id-projeto>
FIREBASE_STORAGE_BUCKET=<seu-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<seu-id-mensagem>
FIREBASE_APP_ID=<seu-id-app>
