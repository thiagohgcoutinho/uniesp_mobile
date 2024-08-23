import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'
import React from 'react'

const Exercicio03 = () => {

    const [text, setText] = useState('')

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Digite algo aqui..."
      />
      <Text>Você digitou: {text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        aligntItems: 'center',
        justifyContent: 'center',
        padding: 100
    }
})

export default Exercicio03