import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PlantScreen = () => {
  const navigation = useNavigation();
  const [newPlant, setNewPlant] = useState({
    name: "",
    frequency: "",
    sunlight: "",
    soilcare: "",
    ideal_temperature: "",
    planting_time: "",
    lifespan: "",
    category_name: "",
  });

  const [isContainerVisible, setIsContainerVisible] = useState(true);

  const handleAddNewPlant = async () => {
    try {
      for (let key in newPlant) {
        if (!newPlant[key]) {
          Alert.alert("Error", "Please fill out all fields");
          return;
        }
      }

      const response = await fetch(
        "http://10.30.10.210/compproject/add_plant.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlant),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success!", "Plant added successfully!");
        setIsContainerVisible(false);
        navigation.goBack(); // Geri dön
      } else {
        throw new Error(data.Message || "Unexpected error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while adding the plant");
    }
  };

  const handleInputChange = (key, text) => {
    setNewPlant((prevState) => ({
      ...prevState,
      [key]: text,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {isContainerVisible && (
          <View style={styles.sideContainer}>
            {Object.keys(newPlant).map((key) => (
              <View key={key} style={styles.box}>
                <TextInput
                  placeholder={`Enter ${key.replace("_", " ")}`}
                  value={newPlant[key]}
                  onChangeText={(text) => handleInputChange(key, text)}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addPlantButton}
              onPress={handleAddNewPlant}
            >
              <Image
                source={require("./assets/plus.png")}
                style={styles.addPlantButtonImage}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sideContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  box: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
  },
  addPlantButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addPlantButtonImage: {
    width: 20,
    height: 20,
  },
  closeButtonImage: {
    width: 20,
    height: 20,
  },
});

export default PlantScreen;
