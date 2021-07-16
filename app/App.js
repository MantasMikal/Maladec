import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PROD = false;
export default function App() {
  const [users, setUsers] = React.useState([]);
  console.log(users);
  axios
    .get("http://localhost:4000/users")
    .then((response) => {
      setUsers(response.data.users);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
