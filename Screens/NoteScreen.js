// NoteScreen.js
import React, {useState, useEffect}  from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import * as Location from "expo-location";

export default function NoteScreen({ navigation, route }) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [location, setLocation] = React.useState(null);
  const [checked, setChecked] = useState(false);

  const handleSave = () => {
    // Retrieve onSave function from route.params
    const onSave = route.params?.onSave;
    let finalContent = content;
    if (onSave) {
      console.log(checked);
      if (checked) {
        console.log("Location checked");
        // If checked, add the location to the content
        finalContent = `${content}\n\nSijainti: ${location.coords.latitude}, ${location.coords.longitude}`;
        console.log(finalContent);
      }
      onSave({ title, content: finalContent }); // Pass the new note
    }
    navigation.goBack(); // Navigate back
  };

  // Functionality to toggle the checkbox
  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  // Get permission to use location and get the current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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

      <Pressable style={styles.container} onPress={toggleCheckbox}>
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Text style={styles.checkmark}>✔</Text>}
        </View>
        <Text style={styles.label}>Käytä sijaintia</Text>
      </Pressable>
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
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: "#007aff",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
