import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import firestore from "@react-native-firebase/firestore";
import PushNotification from "react-native-push-notification";
import "./PushNotificationConfig";
const FirebaseTodo = () => {
  const [todoText, setTodoText] = useState("");
  const todosRef = firestore().collection("Todos");
  const [data, setData] = useState([]);
  const [todos, setTodos] = useState([]);
  const [update, setUpdate] = useState(null);
  const ref = useRef(null);

  async function addTodo() {
    const newTodo = {
      todo: todoText,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    let x = await todosRef.add(newTodo);
    setTodoText("");
    try {
      PushNotification.localNotification({
        channelId: "55",
        title: "Todo Added",
        message: "A new todo has been added successfully!",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function updateTodo() {
    const newTodo = {
      todo: todoText,
      createdAt: update.createdAt,
    };
    await todosRef.doc(update.id).update(newTodo);
    setTodoText("");
    setUpdate(null);
  }

  const deleteTodo = async (id) => {
    await todosRef.doc(id).delete();
  };

  useEffect(() => {
    return todosRef.orderBy("createdAt", "asc").onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const { todo, createdAt } = doc.data();
        list.push({
          id: doc.id,
          todo,
          createdAt,
        });
      });

      setTodos(list);
    });
  }, []);

  const renderItem = ({ item, index, drag, isActive }) => (
    <ScaleDecorator>
      <OpacityDecorator activeOpacity={0.5}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={drag}
            style={[
              styles.item,
              { backgroundColor: isActive ? "#e0e0e0" : "#fff" },
            ]}
          >
            <View style={styles.todos}>
              <Text>{index}</Text>
              <Text style={styles.text}>{item.todo}</Text>
              <Button
                title="Edit"
                onPress={() => {
                  setTodoText(item.todo), setUpdate(item);
                }}
              />
              <Button title="Remove" onPress={() => deleteTodo(item.id)} />
            </View>
          </TouchableOpacity>
        </ShadowDecorator>
      </OpacityDecorator>
    </ScaleDecorator>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add Todo"
        value={todoText}
        onChangeText={setTodoText}
      />
      {update ? (
        <Button title="Update Todo" onPress={updateTodo} />
      ) : (
        <Button title="Add Todo" onPress={addTodo} />
      )}
      <GestureHandlerRootView style={styles.container}>
        <DraggableFlatList
          ref={ref}
          data={todos}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setTodos(data)}
          renderItem={renderItem}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  todos: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    margin: 10,
    backgroundColor: "#faf0e6",
    borderRadius: 10,
  },
});

export default FirebaseTodo;
