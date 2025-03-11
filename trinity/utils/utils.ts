import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";

export async function getJwtFromStorage(): Promise<string | null> {
  console.log("jwt trouvé : ", await AsyncStorage.getItem("jwt"));

  return await AsyncStorage.getItem("jwt");
}

export async function logoutUser(): Promise<void> {
  try {
    console.log("Déconnexion de l'utilisateur...");
    await AsyncStorage.removeItem("jwt");

    const remainingToken = await AsyncStorage.getItem("jwt");
    if (remainingToken === null) {
      console.log("Utilisateur déconnecté avec succès");
      router.replace("/(tabs)");
    } else {
      console.error("Échec de la déconnexion: le token est toujours présent");
      Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion");
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion");
  }
}
