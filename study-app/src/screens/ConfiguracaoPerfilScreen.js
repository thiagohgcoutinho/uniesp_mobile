import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

const ConfiguracaoPerfilScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosPerfil = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { nome, curso, fotoPerfil } = docSnap.data();
          setNome(nome || "");
          setCurso(curso || "");
          setFotoPerfil(fotoPerfil || null);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil: ", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    carregarDadosPerfil();
  }, [user]);

  const salvarPerfil = async () => {
    if (!nome.trim() || !curso.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        nome,
        curso,
        fotoPerfil,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar perfil: ", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmacaoSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, novaSenha);
      Alert.alert("Sucesso", "Senha alterada com sucesso. Faça login novamente.");
      logout();
    } catch (error) {
      console.error("Erro ao alterar senha: ", error);
      Alert.alert("Erro", "Não foi possível alterar a senha. Verifique sua senha atual.");
    }
  };

  const selecionarImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Você precisa conceder permissão para acessar a galeria de imagens."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem: ", error);
      Alert.alert("Erro", "Não foi possível acessar a galeria.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={selecionarImagem} style={styles.avatarContainer}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <MaterialIcons name="person" size={50} color="#fff" />
            </View>
          )}
          <Text style={styles.avatarText}>Alterar Foto</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Curso:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu curso"
          placeholderTextColor="#aaa"
          value={curso}
          onChangeText={setCurso}
        />

        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.inputDisabled}
          value={user?.email || ""}
          editable={false}
        />

        <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
          <MaterialIcons name="save" size={18} color="#fff" />
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.changePasswordText}>Alterar Senha</Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <Text style={styles.label}>Senha Atual:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite sua senha atual"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={senhaAtual}
                onChangeText={setSenhaAtual}
              />
              <Text style={styles.label}>Nova Senha:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite sua nova senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
              <Text style={styles.label}>Confirmação da Nova Senha:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Confirme sua nova senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmacaoSenha}
                onChangeText={setConfirmacaoSenha}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={alterarSenha}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    marginTop: 10,
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  changePasswordText: {
    fontSize: 14,
    color: "#007bff",
    textAlign: "center",
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  confirmButton: {
    backgroundColor: "#007bff",
  },
});

export default ConfiguracaoPerfilScreen;
