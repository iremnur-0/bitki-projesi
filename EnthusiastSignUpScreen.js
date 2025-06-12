import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default class EnthusiastSignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname_ent: "",
      email: "",
      password: "",
      confirm_password: "",
    };
  }

  InsertRecord = () => {
    const { nickname_ent, email, password, confirm_password } = this.state;

    if (
      nickname_ent.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirm_password.length === 0
    ) {
      alert("Required Field is missing!");
    } else {
      var InsertAPIURL = "http://10.30.10.210/compproject/insert1.php";
      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      var Data = {
        nickname: nickname_ent,
        email: email,
        password: password,
        confirm_password: confirm_password,
      };

      fetch(InsertAPIURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((Response) => Response.json())
        .then((response) => {
          alert(response[0].Message);
          if (response[0].Message === "User has been registered successfully") {
            this.handleSignIn();
          }
        })
        .catch((error) => {
          alert("error" + error);
        });
    }
  };

  handleSignIn = () => {
    this.props.navigation.navigate("EnthusiastSignIn");
  };

  render() {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ImageBackground
          source={require("./assets/enthusiast.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>
            <View style={styles.viewStyle}>
              <TextInput
                placeholder="Nickname"
                placeholderTextColor="black"
                style={styles.txtStyle}
                onChangeText={(nickname_ent) => this.setState({ nickname_ent })}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="black"
                style={styles.txtStyle}
                onChangeText={(email) => this.setState({ email })}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="black"
                style={styles.txtStyle}
                onChangeText={(password) => this.setState({ password })}
              />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="black"
                style={styles.txtStyle}
                onChangeText={(confirm_password) =>
                  this.setState({ confirm_password })
                }
              />
              <Button
                title="Save Record"
                onPress={this.InsertRecord}
                color="#F97B22"
              />
            </View>
          </View>
        </ImageBackground>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  viewStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  txtStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 20,
    padding: 10,
    width: 200,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
