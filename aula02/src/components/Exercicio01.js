import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Exercicio01 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box1} />
      <View style={styles.box2} />
      <View style={styles.box3} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box1: {
        height: 100,
        width: '100%',
        backgroundColor: 'red',
    },
    box2: {
        height: 100,
        width: '100%',
        backgroundColor: 'green',
    },
    box3: {
        height: 100,
        width: '100%',
        backgroundColor: 'blue',
    },
})


export default Exercicio01