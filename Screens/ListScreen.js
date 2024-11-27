import { app } from "../firebaseConfig";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
} from "firebase/database";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";

export default function ListScreen() {
  // State to hold the list of items and item keys
  const [items, setItems] = useState([]);
  const [itemKeys, setItemKeys] = useState([]);

  // Get the database from the firebase app
  const database = getDatabase(app);

  // State to hold the note
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  // Fetch items from firebase
  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(Object.values(data)); // Get array of items
        setItemKeys(Object.keys(data)); // Get array of corresponding item keys
      } else {
        setItems([]); // Handle the case when there are no items
        setItemKeys([]); // Or itemkeys
      }
    });
  }, []);

  // Save a new note to firebase
  const handleSave = () => {
    if (note.content && note.title) {
      push(ref(database, "items/"), note);
    } else {
      Alert.alert("Virhe", "Kirjoita muistiinpanon otsikko ja sisältö.");
    }
  };

  // Delete a note from Firebase
  const handleDelete = (index) => {
    Alert.alert(
      "Varmista Poisto",
      "Haluatko varmasti poistaa tämän muistiinpanon?",
      [
        {
          text: "Kyllä",
          onPress: () => {
            const itemKey = itemKeys[index]; // Get the key of the note to delete
            const itemRef = ref(database, `items/${itemKey}`);
            remove(itemRef)
              .then(() => {
                Alert.alert(
                  "Poistettu",
                  "Muistiinpano poistettu onnistuneesti."
                );
              })
              .catch((error) => {
                Alert.alert(
                  "Virhe",
                  "Muistiinpanoa ei voitu poistaa: " + error.message
                );
              });
          },
          style: "destructive",
        },
        {
          text: "Ei",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View style={styles.container}>
      {/* Input fields for title and content */}
      <View style={styles.header}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Otsikko"
            onChangeText={(text) => setNote({ ...note, title: text })}
            value={note.title}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Sisältö"
            onChangeText={(text) => setNote({ ...note, content: text })}
            value={note.content}
            multiline
            numberOfLines={5}
          />
          {/* Save button */}
          <Button onPress={handleSave} title="Tallenna" />
        </View>
      </View>
      {/* Line separator */}
      <View style={styles.separator} />

      {/* List of notes */}
      <FlatList
        style={{padding: 10}}
        data={items}
        renderItem={({ item, index }) => (
          <View style={styles.listContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
            <Button title="Poista" onPress={() => handleDelete(index)}/>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row", // Row layout for inputs and button
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  inputSection: {
    flex: 2,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#000",
    marginHorizontal: 15,
    borderRadius: 1,
    alignSelf: "center",
  },
  saveButton: {
    flex: 1, // Take 1 part of the row
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
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
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
