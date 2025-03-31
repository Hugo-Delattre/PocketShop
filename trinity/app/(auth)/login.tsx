import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import useAuth, { JWT_User, userAtom } from "@/hooks/auth";
import { jwtDecode } from "jwt-decode";
import { useSetAtom } from "jotai";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useSetAtom(userAtom);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Logging in with", username);
      const jwt = await auth.fetchJwtToken({ username, password });
      await auth.saveJwtInStorage(jwt);
      const user: JWT_User = jwtDecode(jwt);
      setUser(user);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
      router.push("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error && <Text>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});
