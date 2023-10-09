import AsyncStorage from "@react-native-async-storage/async-storage";
import ConstantsSourceNode from "expo-constants";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

const STORAGE_KEY = "todos";

export default function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([{ key: "0", description: "Testing" }]);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = () => {
    const newKey = String(todos.length);
    const object = { key: newKey, description: newTodo };
    const newTodos = [...todos, object];
    storeData(newTodos);
    setTodos(newTodos);
    setNewTodo("");
  };

  const getData = async () => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEY)
        .then((req) => JSON.parse(req))
        .then((json) => {
          if (json === null) {
            json = [];
          }
          setTodos(json);
        });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    //AsyncStorage.clear();
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>ToDos</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a ToDo"
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
        returnKeyType="done"
        onSubmitEditing={() => addTodo()}
      />
      <FlatList
        style={styles.list}
        data={todos}
        extraData={todos}
        renderItem={({ item }) => <Text>{item.description}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ConstantsSourceNode.statusBarHeight,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    alignSelf: "center",
  },
  list: {
    width: "80%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
