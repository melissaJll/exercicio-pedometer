import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";

export default function App() {
  // Estados para armazenar informações do pedômetro
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    // Função assíncrona para verificar a disponibilidade do pedômetro e obter os dados de contagem de passos
    // O resultado da verificação de disponibilidade é armazenado na variável isAvailable. Se o pedômetro estiver disponível, isAvailable será true; caso contrário, será false.
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable)); // Define a disponibilidade do pedômetro
      // Aqui, estamos usando a função isAvailableAsync() do módulo Pedometer do pacote expo-sensors. Esta função verifica se o pedômetro está disponível no dispositivo atual.
      //       isPedometerAvailable é um estado que armazena a string que indica se o pedômetro está disponível. Inicialmente, estamos definindo o estado como "checking".
      // Usamos String(isAvailable) para converter o valor booleano isAvailable em uma string, porque queremos atualizar o estado com uma string representando o status da disponibilidade do pedômetro.

      // if (String(isAvailable)); definiu isPedometerAvailable como true
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        // Obtém a contagem de passos do período anterior
        const pastStepCountResult = await Pedometer.getStepCountAsync(
          start,
          end
        );
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps); // Define a contagem de passos anterior
        }

        // Inicia a assinatura para obter a contagem de passos em tempo real
        const subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps); // Atualiza a contagem de passos atual
        });

        // Define a função de limpeza para remover a assinatura quando o componente for desmontado
        return () => subscription && subscription.remove();
      }
    };

    // Chama a função de assinatura quando o componente é montado
    const subscription = subscribe();
    // Define a função de limpeza para remover a assinatura quando o componente for desmontado
    return () => subscription && subscription.remove();
  }, []);

  // Renderiza a interface do usuário
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueSection}>
        {/* Exibe a disponibilidade do pedômetro */}
        <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
        {/* Exibe a contagem de passos do período anterior */}
        <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
        {/* Exibe a contagem de passos atual */}
        <Text>Walk! And watch this go up: {currentStepCount}</Text>
      </View>
      <View style={styles.whiteSection}>
        {/* Exibe a disponibilidade do pedômetro */}
        <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
        {/* Exibe a contagem de passos do período anterior */}
        <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
        {/* Exibe a contagem de passos atual */}
        <Text>Walk! And watch this go up: {currentStepCount}</Text>
      </View>
    </SafeAreaView>
  );
}

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  blueSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "66%", // 1/3 da altura da tela
    backgroundColor: "#000326", // Azul marinho
    color: "white",
  },
  whiteSection: {
    position: "absolute",
    top: "33%", // 1/3 da altura da tela
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF", // Branco
  },
});
