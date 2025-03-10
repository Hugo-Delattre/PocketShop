import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getJwtFromStorage(): Promise<string | null> {
  return await AsyncStorage.getItem("jwt");
}

