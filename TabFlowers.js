import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MainContext } from "./MainContext";

const TabFlowers = () => {
  const { nickname } = useContext(MainContext);
  const navigation = useNavigation();

  const handleAddButtonPress = () => {
    navigation.navigate("FavoritePlants");
  };

  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    fetch("http://10.30.10.210/compproject/get_flower.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nickname }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFlowers(data);
      })
      .catch((error) => {
        console.error(error);
        console.error("Error fetching data for nickname:", nickname);
      });
  }, [nickname]);

  const handleTrackingPage = (
    plantNickname,
    plantName,
    idealTemperature,
    sunlight,
    frequency
  ) => {
    navigation.navigate("TrackingPage", {
      plantNickname: plantNickname,
      plantRealName: plantName,
      plantTemperature: idealTemperature,
      plantLight: sunlight,
      frequency: frequency,
    });
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

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}></View>
      <View style={styles.boxContainer}>
        <View style={[styles.box, styles.flowersBox]}>
          <Text style={[styles.boxText, styles.flowersText]}>Flowers</Text>
        </View>
        <View style={[styles.box, styles.vegetablesBox]}>
          <Text style={[styles.boxText]}>Vegetables</Text>
        </View>
        <View style={[styles.box, styles.fruitsBox]}>
          <Text style={[styles.boxText]}>Fruits</Text>
        </View>
      </View>
      <Text style={styles.title}>My Flowers</Text>

      {flowers.map((flower, index) => (
        <TouchableOpacity
          key={index}
          style={styles.rectangleContainer}
          onPress={() =>
            handleTrackingPage(
              flower.plant_nickname,
              flower.name,
              flower.ideal_temperature,
              flower.sunlight,
              flower.frequency
            )
          }
        >
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(flower.name)}
              style={{ width: 120, height: 100, resizeMode: "contain" }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text1}>{flower.plant_nickname}</Text>
            <Text style={styles.text2}>{flower.frequency}</Text>
            <Text style={styles.text2}>{flower.ideal_temperature}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
        <AntDesign name="pluscircle" size={50} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 30,
  },
  box: {
    width: 100,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flowersBox: {
    backgroundColor: "green",
  },
  vegetablesBox: {
    backgroundColor: "#739072",
  },
  fruitsBox: {
    backgroundColor: "#739072",
  },

  boxText: {
    marginTop: 5,
    textAlign: "center",
  },
  rectangleContainer: {
    flexDirection: "row",
    width: "90%",
    height: 100,
    marginTop: 20,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    zIndex: 1,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(144, 238, 144, 0.7)",
    height: 100,
    width: "95%",
    marginLeft: 30,
    paddingLeft: 20,
    borderRadius: 20,
    zIndex: 0,
  },
  text1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
    paddingLeft: 20,
  },
  text2: {
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 20,
    paddingLeft: 20,
  },
});

export default TabFlowers;
