import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Modal,
} from "react-native";

const FavoritePlants = ({ route }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const { nickname, userType } = route.params;
  const [plantDetails, setPlantDetails] = useState([]);
  const [favoritePlants, setFavoritePlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nickText, setNickText] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch("http://10.30.10.210/compproject/fav_plant.php")
      .then((response) => response.json())
      .then((data) => {
        setFavoritePlants(data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleConfirmAddPlant = (plant) => {
    setShowInput(true);
    setNickText("");
    setSelectedPlant(plant);
  };

  const getImageSource = (plantName) => {
    switch (plantName.toLowerCase()) {
      case "pear":
        return require("./assets/pear.png");
      case "china rose":
        return require("./assets/ChineRose.jpg");
      case "cucumber":
        return require("./assets/cucumber.jpg");
      case "flamingo":
        return require("./assets/flamingoflower.png");
      case "lily":
        return require("./assets/lily.png");
      case "pepper":
        return require("./assets/pepper.png");
      case "apple":
        return require("./assets/apple.png");
      case "carrot":
        return require("./assets/carrot.png");
      case "mandarin orange":
        return require("./assets/mandarinorange.png");
      case "red raspberry":
        return require("./assets/Redraspberry.png");

      default:
        return require("./assets/default.png");
    }
  };

  const handleAddPlant = async () => {
    if (!selectedPlant || !nickText) {
      Alert.alert("Error", "Please enter a nickname for the plant.");
      return;
    }

    const plantData = {
      nickname: nickname,
      plant_nickname: nickText,
      plant_name: selectedPlant.name,
      frequency: selectedPlant.frequency,
      category: selectedPlant.category_name,
    };

    try {
      const response = await fetch(
        "http://10.30.10.210/compproject/user_plants.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plantData),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Plant added to your list successfully.");
        setShowInput(false);
      } else {
        Alert.alert("Error", "Failed to add plant.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add plant.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.heading, { color: "black" }]}>
          Favorite Plants
        </Text>
      </View>
      <FlatList
        data={favoritePlants}
        renderItem={({ item }) => (
          <View style={styles.horizontalContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={getImageSource(item.name)}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Name: {item.name}</Text>
              <Text style={styles.infoText}>Frequency: {item.frequency}</Text>
              <Text style={styles.infoText}>
                Category: {item.category_name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addContainer}
              onPress={() => handleConfirmAddPlant(item)}
            >
              <Image
                source={require("./assets/add.png")}
                style={styles.addIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
      />

      {showInput && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showInput}
          onRequestClose={() => {
            setShowInput(!showInput);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Add Nickname"
                value={nickText}
                onChangeText={(text) => setNickText(text)}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPlant}
              >
                <Text style={styles.buttonText}>Add Plant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowInput(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#50C878",
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 50,
    overflow: "hidden",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
  },
  addContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  addIcon: {
    width: 50,
    height: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#50C878",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default FavoritePlants;
