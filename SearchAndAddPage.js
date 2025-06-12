import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

const SearchAndAddPage = ({ route, navigation }) => {
  const { nickname, userType } = route?.params || {};
  const [searchText, setSearchText] = useState("");
  const [plantDetails, setPlantDetails] = useState([]);
  const [error, setError] = useState(null);
  const [nickText, setNickText] = useState("");
  const [isContainerVisible, setIsContainerVisible] = useState(false);

  const ScrollViewRef = useRef(null);

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

  const inputRef = useRef(null);

  const handleInputFocus = () => {
    setTimeout(() => {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        const scrollTo = pageY + height;
        const screenHeight = Dimensions.get("window").height;
        const scrollAmount = scrollTo - screenHeight + 100;
        if (scrollAmount > 0) {
          ScrollViewRef.current.scrollTo({ y: scrollAmount });
        }
      });
    }, 100);
  };

  const handleInputBlur = () => {
    ScrollViewRef.current.scrollTo({ y: 0 });
  };

  const handleInputChange = (field, value) => {
    setNewPlant({ ...newPlant, [field]: value });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "http://10.30.10.210/compproject/check_plant.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: searchText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          "Success!",
          "Plant exists!",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        setPlantDetails(data.Data);
        setError(null);
      } else if (response.status === 404) {
        Alert.alert(
          "Error",
          "Plant could not be found",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        setPlantDetails([]);
        setError("Plant could not be found");
      } else {
        throw new Error("Unexpected error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An unexpected error occurred",
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      setPlantDetails([]);
      setError("An unexpected error occurred");
    }
  };

  const handleAddPlant = async () => {
    try {
      if (!nickText) {
        Alert.alert(
          "Error",
          "Please enter a nickname",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return;
      }

      if (plantDetails.length === 0) {
        Alert.alert(
          "Error",
          "Please search and select a plant first",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return;
      }

      const plantData = {
        nickname: nickname,
        plant_nickname: nickText,
        name: plantDetails[0].name,
        frequency: plantDetails[0].frequency,
        category: plantDetails[0].category_name,
      };

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

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert(
          "Success!",
          "Nickname added successfully!",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      } else {
        throw new Error(data.Message || "Unexpected error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while adding the nickname",
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  const handleAddNewPlant = async () => {
    try {
      for (let key in newPlant) {
        if (!newPlant[key]) {
          Alert.alert(
            "Error",
            "Please fill out all fields",
            [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
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

      if (response.status === 200) {
        Alert.alert(
          "Success!",
          "Plant added successfully!",
          [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        setIsContainerVisible(false);
      } else {
        throw new Error(data.Message || "Unexpected error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while adding the plant",
        [{ text: "Ok", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  return (
    <ImageBackground style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={ScrollViewRef}>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            {}
            <Image
              source={require("./assets/background2.png")}
              style={styles.searchBackground}
            />
            {}
            <View style={[styles.inputContainer, { position: "absolute" }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                placeholder="Enter a plant name"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </View>
            {}
            <TouchableOpacity
              style={[styles.searchButton, { position: "absolute" }]}
              onPress={handleSearch}
            >
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.plantDetailsContainer}>
            {plantDetails.length > 0 && (
              <View style={styles.plantDetails}>
                <Text style={styles.plantDetailText}>
                  <Text style={styles.plantDetailTitle}>Name:</Text>{" "}
                  {plantDetails[0].name}
                </Text>
                <Text style={styles.plantDetailText}>
                  <Text style={styles.plantDetailTitle}>Category:</Text>{" "}
                  {plantDetails[0].category_name}
                </Text>
                <View style={styles.plantDetailSubContainer}>
                  <View style={styles.plantDetailSub1}>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/thermometer.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Ideal Temperature: {plantDetails[0].ideal_temperature}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image style={styles.icon} />
                      <Text style={styles.plantDetailText}>
                        Frequency: {plantDetails[0].frequency}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/plant.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Lifespan: {plantDetails[0].lifespan}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/plant.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Soilcare: {plantDetails[0].soilcare}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.plantDetailSub2}>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/sun.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Sunlight: {plantDetails[0].sunlight}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/schedule.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Planting Time: {plantDetails[0].planting_time}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image
                        source={require("./assets/drop.png")}
                        style={styles.icon}
                      />
                      <Text style={styles.plantDetailText}>
                        Watering: {plantDetails[0].water}
                      </Text>
                    </View>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter plant nickname"
                  value={nickText}
                  onChangeText={(text) => setNickText(text)}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddPlant}
                >
                  <Text style={styles.buttonText}>Add Plant</Text>
                </TouchableOpacity>
              </View>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </ScrollView>
      {userType === "expert" && (
        <TouchableOpacity
          style={styles.addPlantButton}
          onPress={() => navigation.navigate("Plant")}
        >
          <Image
            source={require("./assets/add.png")}
            style={styles.addPlantButtonImage}
          />
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchButton: {
    backgroundColor: "#F6F6F6",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    right: 10,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
    position: "relative",
    height: 80,
    marginTop: 20,
    width: "100%", // Tüm ekran genişliğinde
    paddingRight: 10, // Sağdan boşluk eklendi
  },

  searchBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 5,
  },

  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    opacity: 0.8,
    borderRadius: 5,
    marginRight: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 8,
  },

  plantDetailsContainer: {
    alignItems: "center",
    //width: "100%",
  },
  plantDetails: {
    backgroundColor: "#E6F2E6",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    width: "100%",
  },
  plantDetailText: {
    fontSize: 14,
    marginBottom: 5,
  },
  plantDetailTitle: {
    fontWeight: "bold",
  },
  plantDetailSubContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    overflow: "hidden",
  },
  plantDetailSub1: {
    width: "48%",
  },
  plantDetailSub2: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  addPlantButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addPlantButtonImage: {
    width: 40,
    height: 40,
  },
});

export default SearchAndAddPage;
