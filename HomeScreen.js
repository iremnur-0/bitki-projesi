import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { styles } from "./styles";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>Welcome!</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate("ExpertHome", { userType: "expert" })
            }
          >
            <Text style={styles.optionText}>Expert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate("EnthusiastHome", { userType: "enthusiast" })
            }
          >
            <Text style={styles.optionText}>Enthusiast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
