import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 50,
    color: "#3A4D39",
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 20,
    color: "#4F6F52",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7C9070",
    padding: 25,
    margin: 10,
    borderRadius: 50,
  },
  optionText: {
    fontSize: 20,
    color: "#FEE8B0",
    fontWeight: "bold",
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#7C9070",
    padding: 25,
    borderRadius: 50,
    width: 200,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FEE8B0",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: 200,
  },
});
