import React, { useState } from "react";
import LoginScreen from "./Screens/LoginScreen";
import RecipeScreen from "./Screens/RecipeScreen";
import ListScreen from "./Screens/ListScreen";
import PriceScreen from "./Screens/PriceScreen";
import NoteScreen from "./Screens/NoteScreen";
import CalendarScreen from "./Screens/CalendarScreen";
import SingleRecipeScreen from "./Screens/SingleRecipeScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet } from "react-native";

// Import the screens and components needed for the app
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for the various screens needed for the notes tab
function ListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeScreen"
        component={RecipeScreen}
        options={{ title: "Lisää resepti:" }}
      />
      <Stack.Screen
        name="NoteScreen"
        component={NoteScreen}
        options={{ title: "Lisää muistiinpano:" }}
      />
      <Stack.Screen
        name="SingleRecipeScreen"
        component={SingleRecipeScreen}
        options={{ title: "Resepti" }}
      />
    </Stack.Navigator>
  );
}

// Custom header for the tab bar so that it renders an icon
const HeaderWithIcon = ({ title }) => (
  <View style={styles.listcontainer}>
    <Ionicons name={"home"} size={20} color="black" />
    <Text style={styles.headerText}>Kotinen -</Text>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

// Main app navigator for the tab bar
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Pörssisähkö") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Muistiinpanot") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Kalenteri") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Pörssisähkö"
        component={PriceScreen}
        options={{ headerTitle: () => <HeaderWithIcon title="Pörssisähkö" /> }}
      />
      <Tab.Screen
        name="Muistiinpanot"
        component={ListStack}
        options={{
          headerTitle: () => <HeaderWithIcon title="Muistiinpanot" />,
        }}
      />
      <Tab.Screen
        name="Kalenteri"
        component={CalendarScreen}
        options={{ headerTitle: () => <HeaderWithIcon title="Kalenteri" /> }}
      />
    </Tab.Navigator>
  );
}

// The actual app component, which is separate so the login page can
// hide the main app when not logged in
export default function App() {
  // State to check login status
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp" component={MainApp} />
        ) : (
          <Stack.Screen name="LoginScreen">
            {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 5,
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 5,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
