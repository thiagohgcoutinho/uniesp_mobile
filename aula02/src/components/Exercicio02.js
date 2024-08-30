import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Exercicio02 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: 'purple',
    }
})

export default Exercicio02