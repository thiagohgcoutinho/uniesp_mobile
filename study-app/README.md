# Study App

## 📚 Introdução
O **Study App** é um aplicativo para gerenciamento de cartões de estudo, desenvolvido em React Native. Ele utiliza o Firebase para autenticação e armazenamento de dados, proporcionando uma experiência intuitiva e eficiente para organizar tarefas e metas de estudo.

---

## 🛠 Requisitos
Para executar o projeto, você precisará das seguintes ferramentas instaladas:
- Node.js
- Expo CLI
- Um editor de código (utilizado: Visual Studio Code)
- Um dispositivo ou emulador para testar (Android/iOS)

---

## 📂 Estrutura de Pastas
Abaixo está a organização das pastas do projeto e uma breve descrição de cada uma:

| Caminho                  | Descrição                                               |
|--------------------------|---------------------------------------------------------|
| **study-app/**           | Diretório raiz do projeto.                              |
| ├── **assets/**          | Contém imagens e ícones utilizados no app.             |
| ├── **src/**             | Código-fonte principal.                                |
| │   ├── **config/**      | Configuração do Firebase.                              |
| │   ├── **contexts/**    | Contextos para gerenciamento de estado.                |
| │   ├── **screens/**     | Telas do aplicativo.                                   |
| ├── **.env**             | Variáveis de ambiente sensíveis.                       |
| ├── **app.json**         | Configurações do aplicativo Expo.                      |
| ├── **package.json**     | Dependências e scripts do projeto.                     |
| ├── **eas.json**         | Configurações do EAS (Expo Application Services).      |
| └── **App.js**           | Arquivo principal do aplicativo.                       |

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
   - **Melhorias**:
     - Melhorias no design dos botões, com ícones e cores mais atrativas.
     - Adição de bordas coloridas para indicar prazos.
     - Ícone de alerta para tarefas em atraso ou próximas ao vencimento.

2. **`EdicaoCartaoScreen.js`**
   - Tela para criar ou editar um cartão.
   - Campos para título, notas, data de término e status.
   - Utiliza um seletor de data e hora e opções de status.
   - **Melhorias**:
     - Centralização do `DateTimePicker` para telas maiores.
     - Ajuste do modal de seleção de status para uma experiência visual mais agradável e responsiva.
     - Alinhamento dos campos e placeholders visuais aprimorados.

3. **`LoginScreen.js`**
   - Tela para autenticar o usuário com email e senha.
   - Navegação para a tela de registro em caso de novo usuário.
   - **Melhorias**:
     - Adição de um botão "Esqueci minha senha", permitindo redefinição de senha via Firebase.
     - Botões com ícones para melhorar o visual e a usabilidade.

4. **`RegistroScreen.js`**
   - Tela para criar um novo usuário no Firebase Authentication.
   - Após o registro, redireciona para a tela de login.

5. **`TarefasVencimentoProximoScreen.js`**
   - Exibe uma lista de tarefas com vencimento nos próximos 15 dias.
   - Inclui informações detalhadas como título, status e data/hora de término.
   - **Melhorias**:
     - Refeito o design da tela com botões e cores mais atrativos.
     - Adicionado recurso de deslizar cartões para a esquerda ou direita.
       - Ao deslizar para a direita, o cartão é marcado como concluído e automaticamente removido da lista.
       - Ao deslizar para a esquerda, o cartão é excluído.

6. **`ConfiguracaoPerfilScreen.js`**
   - Permite que o usuário configure ou edite seu perfil.
   - Funcionalidades:
     - Adicionar ou alterar uma foto de perfil.
     - Editar campos como nome completo e curso.
     - Exibe o email do usuário autenticado (não editável).
   - **Melhorias**:
     - Preenchimento automático dos campos caso o perfil já tenha sido criado.
     - Criação automática de um perfil padrão para novos usuários.
     - Opção para alterar senha com modal amigável e campos visualmente alinhados.
     - Design refinado, incluindo placeholders com visual moderno.

---

## 🧰 Bibliotecas Utilizadas
O projeto utiliza as seguintes bibliotecas:
- **`firebase`**: Integração com Firebase Authentication e Firestore.
- **`react-native`**: Framework principal para desenvolvimento do app.
- **`@react-navigation/native`** e **`@react-navigation/stack`**: Gerenciamento de navegação entre telas.
- **`expo-image-picker`**: Seleção de imagens para a foto de perfil.
- **`react-native-modal-datetime-picker`**: Seleção de data e hora.
- **`@react-native-picker/picker`**: Seletor para opções (como status do cartão).
- **`react-native-vector-icons`**: Ícones para uma interface visual atrativa.
- **`react-native-dotenv`**: Gerenciamento de variáveis de ambiente.

---

## 🔥 Melhorias Implementadas
1. Confirmação antes de logout para evitar saídas acidentais.
2. Interface responsiva para tablets e dispositivos grandes, com elementos centralizados.
3. Estilização aprimorada para os modais de seleção de data e status.
4. Swipe com botões redesenhados e integrados ao contexto visual dos cartões.
5. Tela de configuração do perfil com preenchimento automático e suporte para edição.
6. Botões melhorados no `LoginScreen` com a adição de ícones e botão "Esqueci minha senha".
7. Reestilização completa da `TarefasVencimentoProximoScreen`, com suporte para deslizar cartões e exclusão automática de tarefas concluídas.
8. Design refinado na `ListaCartaoScreen`, com ícones de alerta e bordas coloridas para tarefas próximas ao vencimento.
9. Modal de alteração de senha na `ConfiguracaoPerfilScreen` com campos alinhados e placeholders modernos.
10. Criação automática de perfis padrão para novos usuários ao acessar a `ConfiguracaoPerfilScreen`.

---

## 🔒 Variáveis de Ambiente
As configurações sensíveis estão armazenadas no arquivo `.env`:
```env
FIREBASE_API_KEY=<sua-chave-api>
FIREBASE_AUTH_DOMAIN=<seu-domínio-auth>
FIREBASE_PROJECT_ID=<seu-id-projeto>
FIREBASE_STORAGE_BUCKET=<seu-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<seu-id-mensagem>
FIREBASE_APP_ID=<seu-id-app>
