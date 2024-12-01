import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function LoginScreen({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle the login. Very quick and dirty, but it's not like
  // this app is going to contain anything sensitive. If someone wants to
  // find out what we're having for dinner, they're welcome to.
  const handleLogin = () => {
    if (username === "User" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      Alert.alert("Väärä salasana tai käyttäjätunnus", "Tarkista tiedot.");
    }
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});
