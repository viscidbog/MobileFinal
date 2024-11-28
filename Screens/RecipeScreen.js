// RecipeScreen.js
import React from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

export default function RecipeScreen({ navigation, route }) {
  const [keyWord, setKeyWord] = React.useState("");
  const [content, setContent] = React.useState("");
  const [recipes, setRecipes] = React.useState([]);
  const [emptyList, setEmptyList] = React.useState("");
  const apiSearchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  const apiRandomUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

  const handleSave = () => {
    // Retrieve onSave function from route.params
    const onSave = route.params?.onSave;
    if (onSave) {
      onSave({ title, content }); // Pass the new recipe
    }
    navigation.goBack(); // Navigate back
  };

  // Handle moving to the SingleRecipeScreen
  const handleSingleRecipe = (recipe, ingredients) => {
    navigation.navigate("SingleRecipeScreen", { recipe, ingredients });
  }

  // Handle fetching a recipe with the given keyword
  const handleFetchRecipe = async (searchParameter) => {
    console.log(searchParameter);
    try {
      const response = await fetch(searchParameter);
      if (!response.ok) throw new Error("Failed to fetch recipe: " + response.statusText);
      const data = await response.json();
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setEmptyList("Ei löytyneitä reseptejä hakusanalla " + keyWord);
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error in fetch:", error);
    }
  };

  // Calculate the number of ingredients in a meal
  // and return the count as well as a list of ingredients
  const calculateNumberOfIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]?.trim();
      const measure = meal[`strMeasure${i}`]?.trim();
      if (ingredient) {
        ingredients.push({ ingredient, measure });
      }
    }
    return {
      count: ingredients.length,
      list: ingredients,
    };
  };

  return (
    <View style={styles.container}>
      <Button title="Tallenna" onPress={handleSave} />
      <Button title="Peruuta" onPress={() => navigation.goBack()} />
      <TextInput
        placeholder="Hae reseptin nimellä:"
        style={styles.input}
        value={keyWord}
        onChangeText={setKeyWord}
      />

      <Button title="Hae resepti" onPress={() => handleFetchRecipe((apiSearchUrl + keyWord))} />
      <Button title="Hae sattumanvarainen resepti" onPress={() => handleFetchRecipe(apiRandomUrl)} />

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => {
          const numIngredients = calculateNumberOfIngredients(item).count;
          return (
            <TouchableOpacity style={styles.recipeCard} onPress={() => {handleSingleRecipe(item, calculateNumberOfIngredients(item).list )}}>
              <Image
                source={{ uri: item.strMealThumb }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeDetails}>
                <Text>{item.strMeal}</Text>
                <Text>Country: {item.strArea}</Text>
                <Text>Category: {item.strCategory}</Text>
                <Text>Ingredients: {numIngredients}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View>
            <Text>{emptyList}</Text>
          </View>
        )}
      />
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
  recipeCard: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
});