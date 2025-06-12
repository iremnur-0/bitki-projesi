import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { styles } from "./styles";

const backgroundImage = require("./assets/home.jpg");
const emojiImage = require("./assets/emoji.png");

const EnthusiastHomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [emojiPosition, setEmojiPosition] = useState({ x: 10, y: 10 });

  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setEmojiPosition({ x: locationX, y: locationY });
    setModalVisible(true);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Enthusiast Home Screen</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EnthusiastSignIn")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EnthusiastSignUp")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.touchableArea} onTouchStart={handlePress} />
        <EmojiModal
          visible={modalVisible}
          position={emojiPosition}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </ImageBackground>
  );
};

const EmojiModal = ({ visible, position, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View
          style={[modalStyles.modalView, { top: position.y, left: position.x }]}
        >
          <Image source={emojiImage} style={modalStyles.modalImage} />
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 50,
    height: 50,
  },
});

export default EnthusiastHomeScreen;
