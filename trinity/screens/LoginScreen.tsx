import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import useAuth from "../hooks/auth";
export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { fetchJwtToken, saveJwtInStorage, setAuthenticated } = useAuth();
  const handleLogin = () => {
    console.log("Logging in with", username, password);
    fetchJwtToken({ username, password })
      .then((jwt) => saveJwtInStorage(jwt))
      .then(() => {
        console.log("Logged in");
        setAuthenticated(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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
