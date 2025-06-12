import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

const TrackingPage = ({ route }) => {
  const { plantNickname, plantRealName } = route.params;
  const [plantInfo, setPlantInfo] = useState({});
  const [wateringDates, setWateringDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch("http://10.30.10.210/compproject/get_plant_info.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plant_real_name: plantRealName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.frequency) {
          setPlantInfo(data);
        } else {
          setPlantInfo({ ...data, frequency: "once a week" });
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Failed to fetch plant information.");
      });
  }, [plantRealName]);

  const getFrequencyNumber = (frequency) => {
    if (!frequency) {
      return 1;
    }
    switch (frequency.toLowerCase()) {
      case "once a week":
      case "every 1-2 week":
      case "Every 1-2 weeks":
      case "Every week":
      case "every 1/2 week":
        return 1;
      case "twice per week":
      case "twice a week":
      case "twice for each week":
        return 2;
      case "three times a week":
        return 3;
      case "four times a week":
        return 4;
      default:
        return 1;
    }
  };

  const calculateNextWateringDates = (selectedDate, frequency) => {
    const nextDates = [];
    let currentDate = new Date(selectedDate);
    const frequencyNumber = getFrequencyNumber(frequency);
    const daysBetweenWaterings = Math.floor(7 / frequencyNumber);

    for (let i = 0; i < 10; i++) {
      nextDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + daysBetweenWaterings);
    }

    return nextDates;
  };

  const handleAddMultipleWateringDates = (date) => {
    const nextWateringDates = calculateNextWateringDates(
      date,
      plantInfo.frequency
    );
    setWateringDates(
      nextWateringDates.map((date, index) => ({
        date: index === 0 ? date : nextWateringDates[index - 1],
        completed: false,
      }))
    );
    setShowCalendar(false);
  };

  const toggleWatering = (index) => {
    const updatedWateringDates = [...wateringDates];
    updatedWateringDates[index].completed = true;
    setWateringDates(updatedWateringDates);
  };

  const nextIncompleteWateringDateIndex = wateringDates.findIndex(
    (date) => !date.completed
  );

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{plantNickname}</Text>
          <Text style={styles.subHeaderText}>{plantRealName}</Text>
          <Text style={styles.subHeaderText}>
            Frequency: {plantInfo.frequency}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource(plantRealName)}
            style={styles.plantImage}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoCircle}>
          <Text style={styles.infoCircleText}>Planting Time</Text>
          <Text style={styles.infoValueText}>{plantInfo.planting_time}</Text>
        </View>
        <View style={styles.infoCircle}>
          <Text style={styles.infoCircleText}>Temperature</Text>

          <Text style={styles.infoValueText}>
            {plantInfo.ideal_temperature}
          </Text>
        </View>
        <View style={styles.infoCircle}>
          <Text style={styles.infoCircleText}>Sun Exposure</Text>
          <Text style={styles.infoValueText}>{plantInfo.sunlight}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.selectDateButton}
        onPress={() => setShowCalendar(true)}
      >
        <Text style={styles.selectDateButtonText}>
          Select the First Watering Date
        </Text>
      </TouchableOpacity>
      {showCalendar && (
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => {
            handleAddMultipleWateringDates(day.dateString);
            setSelectedDate(day.dateString);
          }}
        />
      )}

      <Text style={styles.title}>Next Watering Dates</Text>
      {nextIncompleteWateringDateIndex !== -1 ? (
        <TouchableOpacity
          style={[styles.dateItem, { backgroundColor: "#F1F1F1" }]}
          onPress={() => toggleWatering(nextIncompleteWateringDateIndex)}
        >
          <Text style={styles.dateText}>
            {wateringDates[
              nextIncompleteWateringDateIndex
            ].date.toLocaleDateString()}
          </Text>
          <Text style={styles.completedText}> Complete it </Text>
        </TouchableOpacity>
      ) : (
        <Text>No more upcoming watering dates</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 18,
    color: "#555555",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  plantImage: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCircleText: {
    textAlign: "center",
    fontSize: 14,
  },
  infoCircle: {
    alignItems: "center",
    width: "30%",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
  },
  infoCircleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  infoValueText: {
    fontSize: 14,
    color: "#666666",
  },
  selectDateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  selectDateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
  },
  completedText: {
    fontSize: 14,
    color: "#FF5722",
  },
  calendar: {
    width: "90%",
    alignSelf: "center",
    marginTop: 5,
  },
});

export default TrackingPage;
