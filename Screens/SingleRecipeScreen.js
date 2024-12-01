import React from "react";
import { app } from "../firebaseConfig";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
} from "firebase/database";

export default function SingleRecipeScreen({ navigation, route }) {
  // Get the recipe and ingredients from the route parameters
  const { recipe, ingredients } = route.params;

  // Get the database from the firebase app
  const database = getDatabase(app);

  // Clean up the ingredients list in preparation for saving to firebase
  const renderIngredientList = (ingredients) => {
    return ingredients
      .map((item) => `${item.ingredient}: ${item.measure}`) // Format each ingredient
      .join("\n"); // Join with new lines
  };

  // Save a new note to firebase
  const handleSave = (title, content) => {
    if (title && content) {
      Alert.alert(
        "Tallenna resepti",
        "Haluatko tallentaa reseptin?",
        [
          {
            text: "Kyllä",
            onPress: () => {
              const newNote = { title, content };
              push(ref(database, "items/"), newNote);
              navigation.navigate("ListScreen");
            },
          },
          {
            text: "Peruuta",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert("Virhe", "Kirjoita muistiinpanon otsikko ja sisältö.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          handleSave(recipe.strMeal, (renderIngredientList(ingredients) + "\n" + recipe.strInstructions ))
        }
      >
        <Image
          source={{ uri: recipe.strMealThumb }}
          style={{ width: "100%", height: 150 }}
        />
        <Text style={styles.titleText}>
          {recipe.strMeal} (Paina tallentaaksesi)
        </Text>
      </TouchableOpacity>
      <View style={styles.horizontalContainer}>
        <Text style={styles.contentText}>Country: {recipe.strArea}</Text>
        <Text style={styles.contentText}>Category: {recipe.strCategory}</Text>
      </View>
      <FlatList
        data={ingredients}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.contentText}>{item.ingredient}</Text>
            <Text style={styles.contentText}>{item.measure}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  horizontalContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
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
    padding: 5,
    marginBottom: 5,
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
