import React from 'react';
import { View, StyleSheet } from 'react-native';

const Exercicio02 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupar toda a tela
    justifyContent: 'center', // Centralizar verticalmente
    alignItems: 'center', // Centralizar horizontalmente
    padding: 10, // Pequeno padding para evitar bordas coladas
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'purple', // Manter a cor roxa
  },
});

export default Exercicio02;
