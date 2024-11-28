// NoteScreen.js
import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function NoteScreen({ navigation, route }) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleSave = () => {
    // Retrieve onSave function from route.params
    const onSave = route.params?.onSave;
    if (onSave) {
      onSave({ title, content }); // Pass the new recipe
    }
    navigation.goBack(); // Navigate back
  };

return (
  <View style={styles.container}>
    <Text style={styles.label}>Otsikko:</Text>
    <TextInput
      style={styles.input}
      value={title}
      onChangeText={setTitle}
      placeholder="..."
    />

    <Text style={styles.label}>Sisältö:</Text>
    <TextInput
      style={[styles.input, styles.textArea]}
      value={content}
      onChangeText={setContent}
      placeholder="..."
      multiline
      numberOfLines={5}
    />

    <Button title="Tallenna" onPress={handleSave} />
    <Button title="Peruuta" onPress={() => navigation.goBack()} />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textArea: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});
