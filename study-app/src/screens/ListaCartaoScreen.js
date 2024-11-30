import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import CartoesEstudoContext from "../contexts/CartoesEstudoContext";
import { MaterialIcons } from "@expo/vector-icons";

const ListaCartaoScreen = ({ navigation }) => {
  const { cartoes, excluirCartao } = useContext(CartoesEstudoContext);

  const renderizarCartao = ({ item }) => {
    const hoje = new Date();
    const dataTermino = new Date(item.dataTermino);
    const diferencaDias = (dataTermino - hoje) / (1000 * 60 * 60 * 24);

    let cardStyle = { ...styles.card };
    let borderColor = "#ced4da"; // Cor padrão para bordas

    if (item.status === "done") {
      borderColor = "#28a745"; // Verde para concluídos
    } else if (item.status === "in_progress") {
      if (diferencaDias > 15) {
        borderColor = "#007bff"; // Azul para > 15 dias
      } else if (diferencaDias <= 15 && diferencaDias > 7) {
        borderColor = "#ffa500"; // Laranja para 7 < dias <= 15
      } else if (diferencaDias <= 7 && diferencaDias >= 0) {
        borderColor = "#dc3545"; // Vermelho para <= 7 dias
      }
    } else if (item.status === "backlog") {
      if (diferencaDias > 15) {
        borderColor = "#6c757d"; // Cinza para > 15 dias
      } else if (diferencaDias <= 15 && diferencaDias >= 0) {
        borderColor = "#ffc107"; // Amarelo para <= 15 dias
      }
    }

    return (
      <View style={[cardStyle, { borderColor }]}>
        <View style={styles.cardHeader}>
          {item.status === "backlog" && diferencaDias <= 15 && (
            <MaterialIcons
              name="warning"
              size={18}
              color="#ffc107"
              style={styles.alertIcon}
            />
          )}
          <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
        <Text style={styles.cardText}>Status: {traduzirStatus(item.status)}</Text>
        <Text style={styles.cardText}>
          Vencimento: {dataTermino.toLocaleDateString()}
        </Text>
        {item.notas && <Text style={styles.cardNotes}>Notas: {item.notas}</Text>}

        <View style={styles.cardButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EdicaoCartao", { id: item.id })}
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

  const traduzirStatus = (status) => {
    switch (status) {
      case "backlog":
        return "Backlog";
      case "in_progress":
        return "Em Progresso";
      case "done":
        return "Concluído";
      default:
        return status;
    }
  };

  const confirmarExclusao = (id) => {
    Alert.alert(
      "Excluir Cartão",
      "Tem certeza que deseja excluir este cartão?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => excluirCartao(id), style: "destructive" },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Botões no topo */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.navigate("TarefasVencimentoProximo")}
        >
          <MaterialIcons name="warning" size={20} color="#ffffff" />
          <Text style={styles.topButtonText}>Tarefas a Vencer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topButton, styles.addButton]}
          onPress={() => navigation.navigate("EdicaoCartao")}
        >
          <MaterialIcons name="add" size={20} color="#ffffff" />
          <Text style={styles.topButtonText}>Adicionar Cartão</Text>
        </TouchableOpacity>
      </View>

      {/* Renderização por status */}
      <Text style={styles.sectionTitle}>Backlog</Text>
      <FlatList
        data={cartoes.filter((cartao) => cartao.status === "backlog")}
        keyExtractor={(item) => item.id}
        renderItem={renderizarCartao}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      <Text style={styles.sectionTitle}>Em Progresso</Text>
      <FlatList
        data={cartoes.filter((cartao) => cartao.status === "in_progress")}
        keyExtractor={(item) => item.id}
        renderItem={renderizarCartao}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      <Text style={styles.sectionTitle}>Concluído</Text>
      <FlatList
        data={cartoes.filter((cartao) => cartao.status === "done")}
        keyExtractor={(item) => item.id}
        renderItem={renderizarCartao}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f7f7f7",
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  topButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4500",
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
  },
  topButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    width: 180,
    justifyContent: "space-between",
    borderWidth: 2, // Todas as bordas têm largura
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cardText: {
    fontSize: 12,
    color: "#555",
  },
  cardNotes: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alertIcon: {
    marginRight: 5,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

export default ListaCartaoScreen;
