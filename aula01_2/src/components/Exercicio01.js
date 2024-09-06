import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

const Exercicio01 = ({ nome }) => {
  return (
    <SafeAreaView>
      <Text>Olá, bem vindo {nome}</Text>
    </SafeAreaView>
  )
}

export default Exercicio01