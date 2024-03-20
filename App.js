import React, { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        const pastStepCountResult = await Pedometer.getStepCountAsync(
          start,
          end
        );
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps); // Define a contagem de passos anterior
        }

        const subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps); // Atualiza a contagem de passos atual
        });

        return () => subscription && subscription.remove();
      }
    };

    // Chama a função de assinatura quando o componente é montado
    const subscription = subscribe();
    // Define a função de limpeza para remover a assinatura quando o componente for desmontado
    return () => subscription && subscription.remove();
  }, []);

  // Função para reiniciar a contagem de passos
  const handleResetSteps = () => {
    setPastStepCount(0);
    setCurrentStepCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaAzul}>
        <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
        <Text style={styles.progresso}>Progresso de Hoje</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>

        <Text style={styles.stepCount}>
          {currentStepCount}
          <Ionicons name="footsteps" size={40} color="white" />
        </Text>
        <Text style={styles.stepLabel}>Passos</Text>
        {/* <Text>Steps taken in the last 24 hours: {pastStepCount}</Text> */}
      </View>
      <View style={styles.whiteSection}>
        <TouchableOpacity
          onPress={handleResetSteps}
          style={styles.botaoResetar}
        >
          <Text style={styles.botaoResetarText}>Reiniciar Contagem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  areaAzul: {
    width: "100%",
    height: "60%",
    marginTop: 0,
    backgroundColor: "#77A476",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteSection: {
    alignItems: "center",
    marginTop: 7,
    // justifyContent: "center" ,
  },
  dateText: {
    fontSize: 18,
    marginBottom: 42,
    color: "white",
  },
  progresso: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  stepCount: {
    fontSize: 70,
    color: "white",
    marginBottom: 22,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },

  botaoResetar: {
    marginTop: 20,
    backgroundColor: "#EF5757",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    overflow: "hidden",
  },
  botaoResetarText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
