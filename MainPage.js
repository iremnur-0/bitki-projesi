import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native"; // Import Image component
import { AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchAndAddPage from "./SearchAndAddPage";
import Forum from "./Forum";
import Swiper from "react-native-swiper";
import TabVegetables from "./TabVegetables";
import TabFruits from "./TabFruits";
import TabFlowers from "./TabFlowers";
import FavoritePlants from "./FavoritePlants";
import { MainContext } from "./MainContext";
import { useNavigation } from "@react-navigation/native";
import PlantScreen from "./PlantScreen";
const Tab = createBottomTabNavigator();

const MainPage = ({ route }) => {
  const { setNickname } = useContext(MainContext);
  const { nickname, userType } = route.params;

  console.log("Nickname:", nickname);
  console.log("User Type:", userType);

  setNickname(nickname);

  return (
    <View style={styles.container}>
      <Swiper style={styles.wrapper} showsButtons={false}>
        <TabVegetables />
        <TabFruits />
        <TabFlowers />
      </Swiper>
    </View>
  );
};

const BottomTabNavigator = ({ route }) => {
  const { nickname, userType } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Forum"
        component={Forum}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/chat.png")}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
        initialParams={{ nickname: nickname, userType: userType }}
      />
      <Tab.Screen
        name="Home"
        component={MainPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/seeds.png")}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
        initialParams={{ nickname: nickname, userType: userType }}
      />
      <Tab.Screen
        name="Search"
        component={SearchAndAddPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/search.png")}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
        initialParams={{ nickname: nickname, userType: userType }}
      />
      <Tab.Screen
        name="FavoritePlants"
        component={FavoritePlants}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("./assets/love.png")}
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          ),
        }}
        initialParams={{ nickname: nickname, userType: userType }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  wrapper: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 100,
  },
});

export default BottomTabNavigator;
