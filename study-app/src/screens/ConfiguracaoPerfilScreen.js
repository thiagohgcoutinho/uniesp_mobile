import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const ConfiguracaoPerfilScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const dados = docSnapshot.data();
          setNome(dados.nome || "");
          setCurso(dados.curso || "");
          setFotoPerfil(dados.fotoPerfil || null);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil: ", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [user.uid]);

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

  const salvarPerfil = async () => {
    if (!nome.trim() || !curso.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);

      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        await setDoc(userDocRef, {
          nome,
          curso,
          email: user.email,
          fotoPerfil,
        });
        Alert.alert("Sucesso", "Perfil criado com sucesso!");
      } else {
        await updateDoc(userDocRef, {
          nome,
          curso,
          fotoPerfil,
        });
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar perfil: ", error);
      Alert.alert("Erro", "Não foi possível salvar o perfil.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
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
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Curso:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu curso"
        value={curso}
        onChangeText={setCurso}
      />

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.email || ""}
        editable={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
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
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfiguracaoPerfilScreen;
