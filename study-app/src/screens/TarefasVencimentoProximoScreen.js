import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import CartoesEstudoContext from "../contexts/CartoesEstudoContext";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const agruparPorData = (cartoes) => {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const hojeString = hoje.toDateString();
  const amanhaString = amanha.toDateString();

  const grupos = {
    Hoje: [],
    Amanhã: [],
    "Próximos 7 Dias": [],
  };

  cartoes
    .filter((cartao) => cartao.status !== "done") // Filtra apenas os cartões backlog e em progresso
    .forEach((cartao) => {
      const dataTermino = new Date(cartao.dataTermino).toDateString();

      if (dataTermino === hojeString) {
        grupos.Hoje.push(cartao);
      } else if (dataTermino === amanhaString) {
        grupos.Amanhã.push(cartao);
      } else if (new Date(cartao.dataTermino) - hoje <= 7 * 24 * 60 * 60 * 1000) {
        grupos["Próximos 7 Dias"].push(cartao);
      }
    });

  return grupos;
};

const traduzirStatus = (status) => {
  switch (status) {
    case "backlog":
      return "Backlog";
    case "in_progress":
      return "Em Progresso";
    default:
      return status;
  }
};

const TarefasVencimentoProximoScreen = () => {
  const { cartoes, atualizarCartao, excluirCartao } = useContext(
    CartoesEstudoContext
  );

  const grupos = agruparPorData(cartoes);

  const marcarComoConcluido = (cartao) => {
    atualizarCartao(cartao.id, { ...cartao, status: "done" });
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

  const renderizarAcoesSwipe = (cartao, tipo) => {
    const isExcluir = tipo === "excluir";
    const actionStyle = isExcluir
      ? styles.swipeDeleteContainer
      : styles.swipeCompleteContainer;
    const iconName = isExcluir ? "delete" : "check";
    const iconColor = isExcluir ? "#dc3545" : "#28a745";

    return (
      <View style={actionStyle}>
        <TouchableOpacity
          onPress={
            isExcluir
              ? () => confirmarExclusao(cartao.id)
              : () => marcarComoConcluido(cartao)
          }
          style={styles.swipeButton}
        >
          <MaterialIcons name={iconName} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderizarCartao = ({ item }) => {
    const dataTermino = new Date(item.dataTermino);

    return (
      <Swipeable
        renderLeftActions={() => renderizarAcoesSwipe(item, "excluir")}
        renderRightActions={() => renderizarAcoesSwipe(item, "concluir")}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardText}>
            Status: <Text style={styles.cardInfo}>{traduzirStatus(item.status)}</Text>
          </Text>
          <Text style={styles.cardText}>
            Vencimento:{" "}
            <Text style={styles.cardInfo}>
              {dataTermino.toLocaleDateString()} às{" "}
              {dataTermino.toLocaleTimeString()}
            </Text>
          </Text>
          {item.notas && (
            <Text style={styles.cardNotes}>Notas: {item.notas}</Text>
          )}
        </View>
      </Swipeable>
    );
  };

  const renderizarGrupo = (titulo, dados) => (
    <View key={titulo}>
      <Text style={styles.sectionTitle}>{titulo}</Text>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarCartao}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {Object.entries(grupos).map(([titulo, dados]) =>
        dados.length ? renderizarGrupo(titulo, dados) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  cardInfo: {
    fontWeight: "bold",
    color: "#333",
  },
  cardNotes: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  swipeCompleteContainer: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    marginVertical: 5,
  },
  swipeDeleteContainer: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    marginVertical: 5,
  },
  swipeButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default TarefasVencimentoProximoScreen;
