import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import { store } from "../toDoApplication/store";
import TodoScreen from "./screen/ToDoScreen";
import { PaperProvider } from "react-native-paper";

const App: React.FC = () => {
  return (
    <Provider store={store}>
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TodoScreen />
        </View>
      </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
});


