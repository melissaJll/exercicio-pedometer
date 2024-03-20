import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";

export default function App() {
  // Estados para armazenar informações do pedômetro
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    // Função assíncrona para verificar a disponibilidade do pedômetro e obter os dados de contagem de passos
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable)); // Define a disponibilidade do pedômetro

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
    <View style={styles.container}>
      {/* Exibe a disponibilidade do pedômetro */}
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      {/* Exibe a contagem de passos do período anterior */}
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      {/* Exibe a contagem de passos atual */}
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
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
});
