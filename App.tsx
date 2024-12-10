import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import VocabularyManagement from "./components/dashboard";

const App = () => {
  return (
    <View>
      <VocabularyManagement />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
