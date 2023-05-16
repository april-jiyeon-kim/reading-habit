import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity } from "react-native";
import Search from "../screens/Search";
import Detail from "../screens/Detail";
import Register from "../screens/Register";
import { Ionicons } from "@expo/vector-icons";
import {
  DETAIL_SCREEN,
  REGISTER_SCREEN,
  SEARCH_SCREEN,
  WRITE_NOTE_SCREEN,
} from "../constants/screenName";
import { DARK_BLUE } from "../styles/colors";
import WriteNote from "../screens/WriteNote";

const ScreenRegister = ({ navigation: { navigate } }) => (
  <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Bookshelf" })}>
    <Text>Go to Bookshelf</Text>
  </TouchableOpacity>
);

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
    }}
  >
    <NativeStack.Screen name={SEARCH_SCREEN} component={Search} />
    <NativeStack.Screen
      name={WRITE_NOTE_SCREEN}
      component={WriteNote}
      options={{
        headerTitle: "Write Note",
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Save")}>
            <Ionicons name="checkmark-sharp" size={24} color={DARK_BLUE} />
          </TouchableOpacity>
        ),
      }}
    />
    <NativeStack.Screen
      name={DETAIL_SCREEN}
      component={Detail}
      options={{
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Save")}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
    <NativeStack.Screen
      name={REGISTER_SCREEN}
      component={Register}
      options={{
        headerTitle: "",
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Save")}>
            <Ionicons name="checkmark-sharp" size={24} color={DARK_BLUE} />
          </TouchableOpacity>
        ),
      }}
    />
  </NativeStack.Navigator>
);

export default Stack;