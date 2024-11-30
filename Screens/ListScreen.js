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
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";

export default function ListScreen({ navigation }) {
  // State to hold the list of items and item keys
  const [items, setItems] = useState([]);
  const [itemKeys, setItemKeys] = useState([]);

  // Get the database from the firebase app
  const database = getDatabase(app);

  // Handle navigating to the RecipeScreen
  const handleAddNote = (screen) => {
    navigation.navigate(screen, {
      onSave: saveNote, // Pass the saveRecipeNote function as a parameter
    });
  };

  // Save a note, separate function to pass to RecipeScreen
  const saveNote = (newNote) => {
    handleSave(newNote.title, newNote.content);
  };

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

  // Save a new note to firebase, with error if left empty
  const handleSave = (title, content) => {
    if (title && content) {
      const newNote = { title, content };
      push(ref(database, "items/"), newNote);
    } else {
      Alert.alert("Virhe", "Kirjoita muistiinpanon otsikko ja sisältö.");
    }
  };

  // Delete a note from Firebase, with alert prompt
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
          <View style={{flexDirection:"row"}}>
          {/* Button to navigate to NoteScreen */}
          <TouchableOpacity
            onPress={() => handleAddNote("NoteScreen")}
            style={styles.button}
          >
            <Text>Tee Muistiinpano</Text>
          </TouchableOpacity>
          {/* Button to navigate to RecipeScreen */}
          <TouchableOpacity
            onPress={() => handleAddNote("RecipeScreen")}
            style={styles.button}
          >
            <Text>Tee Resepti</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Line separator */}
      <View style={styles.separator} />

      {/* List of notes */}
      <FlatList
        style={{ padding: 10 }}
        data={items}
        renderItem={({ item, index }) => (
          <View style={{flex: 1, backgroundColor:"##fff", padding: 5}}>
            <View style={styles.separator} />
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleDelete(index)}><Text>Poista</Text></TouchableOpacity>
            <View style={styles.separator} />
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
  button: {
    flex: 2,
    height: 40,
    margin: 1,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1fb9fc",
    borderRadius: 5,
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
